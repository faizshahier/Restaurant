-- =============================================================================
-- DEMO / SAMPLE DATA  —  NOT for production
-- =============================================================================
-- Populates the EXISTING tables (categories, foods, gallery, settings, orders,
-- order_items) with realistic placeholder content for local development and UI
-- testing. It does NOT create or alter any table, column, function, or policy.
--
-- Every generated row is clearly marked as demo:
--   * order rows use notes starting with '[DEMO]'
--   * gallery titles start with '[DEMO]'
--   * the settings delivery zone says "Sample"
--
-- Restaurant identity fields (name, address, phone, email) are deliberately left
-- EMPTY so you can fill in your own details later. There is no website / cuisine
-- / services / features / description column in this schema, so those are not set.
--
-- Images use royalty-free placeholders from https://picsum.photos.
--
-- Safe to re-run: categories/foods/gallery inserts are guarded with NOT EXISTS,
-- and demo orders are deleted (by their [DEMO] marker) before re-insertion.
--
-- Run this once in the Supabase SQL Editor AFTER the schema exists.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
insert into public.categories (name)
select v.name
from (values
  ('Pizza'),
  ('Burgers'),
  ('Pasta'),
  ('BBQ'),
  ('Rice'),
  ('Sandwiches'),
  ('Salads'),
  ('Desserts'),
  ('Drinks')
) as v(name)
where not exists (
  select 1 from public.categories c where c.name = v.name
);

-- -----------------------------------------------------------------------------
-- Foods  (image = picsum placeholder; a couple are marked unavailable on purpose
-- so the "out of stock" UI has something to show)
-- -----------------------------------------------------------------------------
insert into public.foods (name, description, price, discount_percentage, image, category_id, available)
select
  f.name, f.description, f.price, f.discount_percentage,
  'https://picsum.photos/seed/' || f.seed || '/600/400',
  c.id, f.available
from (values
  -- name, description, price, discount, image-seed, category, available
  ('Margherita Pizza',      'Tomato, fresh mozzarella and basil on a thin crust.',        9.50,  0,  'food-margherita',   'Pizza',      true),
  ('Pepperoni Pizza',       'Loaded with pepperoni and melted mozzarella.',              11.00,  0,  'food-pepperoni',    'Pizza',      true),
  ('BBQ Chicken Pizza',     'Grilled chicken, red onion and smoky BBQ sauce.',           12.50, 10,  'food-bbq-pizza',    'Pizza',      true),
  ('Veggie Supreme Pizza',  'Peppers, mushrooms, olives and sweetcorn.',                 11.50,  0,  'food-veggie-pizza', 'Pizza',      true),
  ('Four Cheese Pizza',     'Mozzarella, cheddar, parmesan and blue cheese.',            12.00,  0,  'food-four-cheese',  'Pizza',      false),

  ('Classic Cheeseburger',  'Beef patty, cheddar, lettuce, tomato and house sauce.',      8.00,  0,  'food-cheeseburger', 'Burgers',    true),
  ('Double Bacon Burger',   'Two patties, crispy bacon and smoked cheese.',             10.50,  0,  'food-bacon-burger', 'Burgers',    true),
  ('Crispy Chicken Burger', 'Buttermilk fried chicken with pickles and mayo.',           8.50,  0,  'food-chicken-burger','Burgers',   true),
  ('Veggie Burger',         'Grilled plant patty with avocado and greens.',              7.50,  0,  'food-veggie-burger','Burgers',    true),
  ('Spicy Jalapeno Burger', 'Beef patty, jalapenos and spicy chipotle mayo.',            9.00, 15,  'food-spicy-burger', 'Burgers',    true),

  ('Spaghetti Bolognese',   'Slow-cooked beef ragu over spaghetti.',                    10.00,  0,  'food-bolognese',    'Pasta',      true),
  ('Fettuccine Alfredo',    'Creamy parmesan sauce with fettuccine.',                   10.50,  0,  'food-alfredo',      'Pasta',      true),
  ('Penne Arrabbiata',      'Penne in a spicy tomato and garlic sauce.',                 9.50,  0,  'food-arrabbiata',   'Pasta',      true),
  ('Lasagna',               'Layered pasta with beef, bechamel and cheese.',            11.00,  0,  'food-lasagna',      'Pasta',      true),
  ('Creamy Pesto Pasta',    'Basil pesto tossed with a light cream sauce.',             10.00,  0,  'food-pesto',        'Pasta',      true),

  ('BBQ Ribs (Half Rack)',  'Slow-smoked pork ribs glazed in BBQ sauce.',               14.00,  0,  'food-ribs',         'BBQ',        true),
  ('Grilled Chicken Platter','Char-grilled chicken with two sides.',                     12.00,  0,  'food-grilled-chic', 'BBQ',        true),
  ('Smoked Beef Brisket',   'Hickory-smoked brisket, sliced to order.',                 15.50, 10,  'food-brisket',      'BBQ',        false),
  ('BBQ Wings (8 pcs)',     'Eight wings tossed in sticky BBQ glaze.',                   8.50,  0,  'food-wings',        'BBQ',        true),

  ('Chicken Biryani',       'Fragrant spiced rice with tender chicken.',                 9.00,  0,  'food-biryani',      'Rice',       true),
  ('Vegetable Fried Rice',  'Wok-fried rice with mixed vegetables.',                     7.50,  0,  'food-veg-rice',     'Rice',       true),
  ('Beef Pilaf',            'Buttery rice cooked with seasoned beef.',                   9.50,  0,  'food-pilaf',        'Rice',       true),
  ('Egg Fried Rice',        'Classic fried rice with egg and scallions.',                7.00,  0,  'food-egg-rice',     'Rice',       true),

  ('Grilled Chicken Sandwich','Grilled chicken, lettuce and garlic mayo.',               6.50,  0,  'food-chic-sand',    'Sandwiches', true),
  ('Club Sandwich',         'Triple-decker with chicken, bacon and egg.',                7.50,  0,  'food-club',         'Sandwiches', true),
  ('Steak & Cheese Sub',    'Sliced steak, peppers and melted cheese.',                  8.50,  0,  'food-steak-sub',    'Sandwiches', true),
  ('Falafel Wrap',          'Crispy falafel, hummus and salad in a wrap.',               6.00,  0,  'food-falafel',      'Sandwiches', true),

  ('Caesar Salad',          'Romaine, croutons, parmesan and Caesar dressing.',          6.50,  0,  'food-caesar',       'Salads',     true),
  ('Greek Salad',           'Cucumber, tomato, olives and feta.',                        6.00,  0,  'food-greek',        'Salads',     true),
  ('Garden Fresh Salad',    'Mixed leaves with seasonal vegetables.',                    5.50,  0,  'food-garden',       'Salads',     true),
  ('Grilled Chicken Salad', 'Leafy greens topped with grilled chicken.',                 7.50,  0,  'food-chic-salad',   'Salads',     true),

  ('Chocolate Lava Cake',   'Warm cake with a molten chocolate centre.',                 5.00,  0,  'food-lava-cake',    'Desserts',   true),
  ('New York Cheesecake',   'Rich baked cheesecake with a biscuit base.',                5.50,  0,  'food-cheesecake',   'Desserts',   true),
  ('Tiramisu',              'Coffee-soaked layers with mascarpone cream.',               5.50,  0,  'food-tiramisu',     'Desserts',   true),
  ('Vanilla Ice Cream',     'Two scoops of vanilla ice cream.',                          3.50,  0,  'food-icecream',     'Desserts',   true),

  ('Fresh Orange Juice',    'Freshly squeezed orange juice.',                            3.00,  0,  'food-orange',       'Drinks',     true),
  ('Iced Lemon Tea',        'Chilled black tea with lemon.',                             2.50,  0,  'food-lemon-tea',    'Drinks',     true),
  ('Cola (Can)',            'Chilled canned cola.',                                      1.50,  0,  'food-cola',         'Drinks',     true),
  ('Mineral Water',         'Still mineral water, 500ml.',                               1.00,  0,  'food-water',        'Drinks',     true),
  ('Mango Smoothie',        'Blended mango with yoghurt and ice.',                       4.00,  0,  'food-mango',        'Drinks',     true)
) as f(name, description, price, discount_percentage, seed, category, available)
join public.categories c on c.name = f.category
where not exists (
  select 1 from public.foods x where x.name = f.name
);

-- -----------------------------------------------------------------------------
-- Gallery  (royalty-free placeholder images)
-- -----------------------------------------------------------------------------
insert into public.gallery (image_url, title)
select v.url, v.title
from (values
  ('https://picsum.photos/seed/gallery-dish-1/800/600',    '[DEMO] Signature Dish'),
  ('https://picsum.photos/seed/gallery-interior-1/800/600','[DEMO] Dining Area'),
  ('https://picsum.photos/seed/gallery-grill-1/800/600',   '[DEMO] From the Grill'),
  ('https://picsum.photos/seed/gallery-dessert-1/800/600', '[DEMO] Dessert Selection'),
  ('https://picsum.photos/seed/gallery-drinks-1/800/600',  '[DEMO] Fresh Drinks'),
  ('https://picsum.photos/seed/gallery-chef-1/800/600',    '[DEMO] Chef at Work'),
  ('https://picsum.photos/seed/gallery-table-1/800/600',   '[DEMO] Table Setting'),
  ('https://picsum.photos/seed/gallery-pizza-1/800/600',   '[DEMO] Wood-Fired Pizza')
) as v(url, title)
where not exists (
  select 1 from public.gallery g where g.title = v.title
);

-- -----------------------------------------------------------------------------
-- Settings  (single row). Identity fields left EMPTY on purpose. Only the
-- demo-relevant fields (opening hours, a sample delivery zone, empty socials)
-- are set here. On an existing row we intentionally do NOT overwrite name/
-- contact fields so anything you may have typed is preserved.
-- -----------------------------------------------------------------------------
insert into public.settings (
  restaurant_name, logo, phone, email, address, delivery_zone,
  opening_hours, social_links, is_singleton
)
values (
  '', '', '', '', '',
  'Sample delivery area — replace with your real delivery zone',
  '{
     "monday":    "09:00-22:00",
     "tuesday":   "09:00-22:00",
     "wednesday": "09:00-22:00",
     "thursday":  "09:00-22:00",
     "friday":    "09:00-23:30",
     "saturday":  "10:00-23:30",
     "sunday":    "10:00-21:00"
   }'::jsonb,
  '{}'::jsonb,
  true
)
on conflict (is_singleton) do update set
  delivery_zone = excluded.delivery_zone,
  opening_hours = excluded.opening_hours,
  social_links  = excluded.social_links;

-- -----------------------------------------------------------------------------
-- Orders + order_items  (this is what powers the admin dashboard / analytics —
-- there is no separate "stats" or "reservations" table in this schema). Statuses
-- and dates are varied so the analytics charts and status filters have data.
-- Totals are computed from the seeded food prices.
-- -----------------------------------------------------------------------------
do $$
declare
  demo_orders jsonb := '[
    {"customer":"Alex",   "phone":"000-0000001","location":"12 Sample Street, Demo City",   "status":"Shipped",   "days_ago":28, "items":[{"food":"Pepperoni Pizza","qty":1},{"food":"Cola (Can)","qty":2}]},
    {"customer":"Bianca", "phone":"000-0000002","location":"5 Placeholder Ave, Demo City",  "status":"Shipped",   "days_ago":24, "items":[{"food":"Double Bacon Burger","qty":2},{"food":"Iced Lemon Tea","qty":2}]},
    {"customer":"Carlos", "phone":"000-0000003","location":"88 Example Road, Demo City",    "status":"Shipped",   "days_ago":21, "items":[{"food":"Chicken Biryani","qty":1},{"food":"Mango Smoothie","qty":1}]},
    {"customer":"Dina",   "phone":"000-0000004","location":"3 Test Lane, Demo City",        "status":"Cancelled", "days_ago":19, "items":[{"food":"Lasagna","qty":1}]},
    {"customer":"Ethan",  "phone":"000-0000005","location":"27 Mock Blvd, Demo City",       "status":"Shipped",   "days_ago":16, "items":[{"food":"BBQ Ribs (Half Rack)","qty":1},{"food":"Caesar Salad","qty":1},{"food":"Fresh Orange Juice","qty":2}]},
    {"customer":"Farah",  "phone":"000-0000006","location":"14 Demo Court, Demo City",      "status":"Shipped",   "days_ago":13, "items":[{"food":"Margherita Pizza","qty":2}]},
    {"customer":"Georgi", "phone":"000-0000007","location":"9 Sample Street, Demo City",    "status":"Shipped",   "days_ago":11, "items":[{"food":"Crispy Chicken Burger","qty":1},{"food":"Cola (Can)","qty":1}]},
    {"customer":"Hana",   "phone":"000-0000008","location":"41 Placeholder Ave, Demo City", "status":"Shipped",   "days_ago":9,  "items":[{"food":"Fettuccine Alfredo","qty":1},{"food":"Tiramisu","qty":1}]},
    {"customer":"Ivan",   "phone":"000-0000009","location":"6 Example Road, Demo City",     "status":"Preparing", "days_ago":4,  "items":[{"food":"Grilled Chicken Platter","qty":1},{"food":"Greek Salad","qty":1}]},
    {"customer":"Jamila", "phone":"000-0000010","location":"33 Test Lane, Demo City",       "status":"Preparing", "days_ago":3,  "items":[{"food":"Spaghetti Bolognese","qty":2},{"food":"Mineral Water","qty":2}]},
    {"customer":"Kenji",  "phone":"000-0000011","location":"18 Mock Blvd, Demo City",       "status":"Pending",   "days_ago":1,  "items":[{"food":"BBQ Chicken Pizza","qty":1},{"food":"BBQ Wings (8 pcs)","qty":1}]},
    {"customer":"Lena",   "phone":"000-0000012","location":"2 Demo Court, Demo City",       "status":"Pending",   "days_ago":1,  "items":[{"food":"Club Sandwich","qty":1},{"food":"Iced Lemon Tea","qty":1}]},
    {"customer":"Marco",  "phone":"000-0000013","location":"77 Sample Street, Demo City",   "status":"Pending",   "days_ago":0,  "items":[{"food":"Veggie Supreme Pizza","qty":1},{"food":"Chocolate Lava Cake","qty":2}]},
    {"customer":"Nadia",  "phone":"000-0000014","location":"10 Placeholder Ave, Demo City", "status":"Pending",   "days_ago":0,  "items":[{"food":"Steak & Cheese Sub","qty":1},{"food":"Mango Smoothie","qty":1}]}
  ]'::jsonb;
  o jsonb;
  item jsonb;
  new_id uuid;
  computed_total numeric;
  order_ts timestamptz;
begin
  -- Clear any previously seeded demo orders (order_items cascade on delete).
  delete from public.orders where notes like '[DEMO]%';

  for o in select value from jsonb_array_elements(demo_orders) loop
    order_ts := now() - ((o->>'days_ago')::int || ' days')::interval;

    insert into public.orders (customer_name, phone, location, notes, status, total, user_id, created_at, updated_at)
    values (
      o->>'customer', o->>'phone', o->>'location',
      '[DEMO] sample order', o->>'status', 0, null, order_ts, order_ts
    )
    returning id into new_id;

    computed_total := 0;

    for item in select value from jsonb_array_elements(o->'items') loop
      insert into public.order_items (order_id, food_id, food_name, quantity, price, created_at)
      select new_id, f.id, f.name, (item->>'qty')::int, f.price, order_ts
      from public.foods f
      where f.name = item->>'food';

      computed_total := computed_total + coalesce(
        (select f.price from public.foods f where f.name = item->>'food'), 0
      ) * (item->>'qty')::int;
    end loop;

    update public.orders set total = computed_total where id = new_id;
  end loop;
end $$;

commit;

-- =============================================================================
-- End of demo data.
-- To remove ONLY the demo orders later:  delete from public.orders where notes like '[DEMO]%';
-- =============================================================================
