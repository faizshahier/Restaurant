-- Restaurant Website — Supabase schema
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- Safe to re-run: tables/functions use IF NOT EXISTS / CREATE OR REPLACE,
-- and policies/triggers are dropped before being recreated.

begin;

create extension if not exists pgcrypto;

-- =========================================================================
-- Helper: keep `updated_at` current on every UPDATE
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- profiles — extends auth.users (1:1). No password column: Supabase Auth
-- owns credentials in auth.users, which PostgREST/the client never expose.
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  phone_number text,
  role text not null default 'Customer'
    check (role in ('Admin', 'Customer', 'restaurant_manager')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'Customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Block a user from granting themselves a higher role. An admin (checked via
-- is_admin() below, which looks at the CALLER's own row, not the row being
-- written) can still change anyone's role.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only an admin can change a user''s role.';
  end if;
  return new;
end;
$$;

-- =========================================================================
-- categories
-- =========================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- =========================================================================
-- foods
-- =========================================================================
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price > 0),
  discount_percentage numeric(5, 2) not null default 0
    check (discount_percentage >= 0 and discount_percentage <= 100),
  image text not null default '',
  -- RESTRICT mirrors the app-level guard in AdminCategoriesPage that blocks
  -- deleting a category still used by a food item.
  category_id uuid references public.categories (id) on delete restrict,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.foods;
create trigger set_updated_at
  before update on public.foods
  for each row execute function public.set_updated_at();

create index if not exists foods_category_id_idx on public.foods (category_id);

-- =========================================================================
-- orders
-- =========================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: guest checkout is supported (no sign-in required to order).
  user_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  phone text not null,
  total numeric(10, 2) not null default 0 check (total >= 0),
  notes text,
  status text not null default 'Pending'
    check (status in ('Pending', 'Preparing', 'Shipped', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- =========================================================================
-- order_items — normalized line items (the app's mock repository models
-- this as a JSON column on `orders`; a real schema uses a join table so
-- each item can reference `foods` with a proper foreign key).
-- =========================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  -- SET NULL, not RESTRICT: an order must stay readable/auditable even after
  -- the food it referenced is later removed from the menu.
  food_id uuid references public.foods (id) on delete set null,
  -- Snapshot of the food's name/price at order time, so edits to the food
  -- afterward (rename, price change) never rewrite historical orders.
  food_name text not null,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_food_id_idx on public.order_items (food_id);

-- =========================================================================
-- gallery
-- =========================================================================
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.gallery;
create trigger set_updated_at
  before update on public.gallery
  for each row execute function public.set_updated_at();

-- =========================================================================
-- settings — single row. is_singleton is always true and is unique, so a
-- second row can never be inserted.
-- =========================================================================
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  logo text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  delivery_zone text not null default '',
  opening_hours jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  is_singleton boolean not null default true check (is_singleton),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint settings_singleton_unique unique (is_singleton)
);

drop trigger if exists set_updated_at on public.settings;
create trigger set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- =========================================================================
-- Role-check helpers for RLS policies. SECURITY DEFINER + a fixed
-- search_path so they run with elevated privilege (bypassing RLS on their
-- own internal lookup) and can't be tricked by a hijacked search_path.
-- =========================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'Admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('Admin', 'restaurant_manager')
  );
$$;

drop trigger if exists prevent_role_self_escalation on public.profiles;
create trigger prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- =========================================================================
-- Row Level Security
-- =========================================================================

-- --- profiles --------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- No INSERT policy: rows are created exclusively by the handle_new_user()
-- trigger (SECURITY DEFINER), which bypasses RLS by design.

-- --- categories --------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "Anyone can view categories" on public.categories;
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- foods --------------------------------------------------------
alter table public.foods enable row level security;

drop policy if exists "Anyone can view foods" on public.foods;
create policy "Anyone can view foods"
  on public.foods for select
  using (true);

drop policy if exists "Staff can manage foods" on public.foods;
create policy "Staff can manage foods"
  on public.foods for all
  using (public.is_staff())
  with check (public.is_staff());

-- --- orders --------------------------------------------------------
alter table public.orders enable row level security;

drop policy if exists "Customers can view own orders" on public.orders;
create policy "Customers can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Staff can view all orders" on public.orders;
create policy "Staff can view all orders"
  on public.orders for select
  using (public.is_staff());

-- Guest checkout is allowed (user_id may be null), but a signed-in caller
-- can only place an order under their own id — never someone else's.
drop policy if exists "Anyone can place an order" on public.orders;
create policy "Anyone can place an order"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (public.is_admin());

-- --- order_items --------------------------------------------------------
alter table public.order_items enable row level security;

drop policy if exists "Customers can view own order items" on public.order_items;
create policy "Customers can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Staff can view all order items" on public.order_items;
create policy "Staff can view all order items"
  on public.order_items for select
  using (public.is_staff());

-- Mirrors the orders INSERT policy: you can only attach items to a guest
-- order or one you own yourself, so a caller can't tamper with someone
-- else's order by guessing its id.
drop policy if exists "Anyone can add items to their own order" on public.order_items;
create policy "Anyone can add items to their own order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );

drop policy if exists "Staff can manage order items" on public.order_items;
create policy "Staff can manage order items"
  on public.order_items for all
  using (public.is_staff())
  with check (public.is_staff());

-- --- gallery --------------------------------------------------------
alter table public.gallery enable row level security;

drop policy if exists "Anyone can view gallery" on public.gallery;
create policy "Anyone can view gallery"
  on public.gallery for select
  using (true);

drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
  on public.gallery for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- settings --------------------------------------------------------
alter table public.settings enable row level security;

drop policy if exists "Anyone can view settings" on public.settings;
create policy "Anyone can view settings"
  on public.settings for select
  using (true);

drop policy if exists "Admins can manage settings" on public.settings;
create policy "Admins can manage settings"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================
-- Seed data
-- =========================================================================

-- Required: the app expects exactly one settings row to exist.
insert into public.settings (
  restaurant_name, logo, phone, email, address, delivery_zone, opening_hours, social_links
)
select
  'The Restaurant',
  '',
  '+1 (555) 010-0000',
  'hello@example.com',
  '123 Main Street, Your City',
  'Within 5 miles of 123 Main Street',
  '{
    "monday": "11:00 - 22:00", "tuesday": "11:00 - 22:00", "wednesday": "11:00 - 22:00",
    "thursday": "11:00 - 22:00", "friday": "11:00 - 23:00",
    "saturday": "10:00 - 23:00", "sunday": "10:00 - 21:00"
  }'::jsonb,
  '{}'::jsonb
where not exists (select 1 from public.settings);

-- Optional: sample catalog data mirroring the app's mock fixtures. Safe to
-- delete this block if you'd rather start with an empty menu.
do $$
declare
  starters_id uuid;
  mains_id uuid;
  desserts_id uuid;
begin
  if not exists (select 1 from public.categories) then
    insert into public.categories (name) values ('Starters') returning id into starters_id;
    insert into public.categories (name) values ('Main Courses') returning id into mains_id;
    insert into public.categories (name) values ('Desserts') returning id into desserts_id;
    insert into public.categories (name) values ('Drinks');

    insert into public.foods (name, description, price, discount_percentage, category_id) values
      ('Bruschetta', 'Grilled bread rubbed with garlic and topped with olive oil, salt, and tomato.', 8.50, 0, starters_id),
      ('Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil.', 15.00, 10, mains_id),
      ('Tiramisu', 'Espresso-soaked ladyfingers layered with mascarpone cream.', 7.00, 0, desserts_id);
  end if;

  if not exists (select 1 from public.gallery) then
    insert into public.gallery (image_url, title) values
      ('', 'The Dining Room'),
      ('', 'Our Open Kitchen'),
      ('', 'Evenings on the Patio'),
      ('', 'A Freshly Plated Dish');
  end if;
end $$;

commit;

-- =========================================================================
-- Next step: promote a user to Admin or restaurant_manager
-- =========================================================================
-- Sign up through the app (or Supabase Studio → Authentication) first —
-- that creates the auth.users row and, via the trigger above, a matching
-- `profiles` row with role 'Customer'. Then run:
--
--   update public.profiles set role = 'Admin' where email = 'you@example.com';
--   update public.profiles set role = 'restaurant_manager', phone_number = '555-0100'
--     where email = 'manager@example.com';
