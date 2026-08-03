-- =============================================================================
-- ADD YOUR OWN MENU PHOTOS  (from public/food_images/)
-- =============================================================================
-- The folder holds 12 usable photos, but the menu has 43 dishes, so a photo is
-- only applied where it actually shows that dish. Nothing is guessed: a burger
-- photo never ends up on a salad.
--
--   Part 1 - 7 existing dishes are given the photo that matches them.
--   Part 2 - 5 dishes are added for photos that had no dish yet, so all 12
--            photos are used.
--   Part 3 - OPTIONAL cleanup of two test rows with broken images.
--
-- Dishes not listed here keep the photo they already have.
-- Vite serves public/food_images/ at /food_images/, so these paths work in
-- development and in the production build.
--
-- Run once in the Supabase SQL Editor.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Part 1: give existing dishes their matching photo
-- -----------------------------------------------------------------------------
update public.foods as f
set image = v.image
from (values
  ('Pepperoni Pizza',      '/food_images/pizza-pepperoni.jpg'),
  ('Veggie Supreme Pizza', '/food_images/pizza-supreme.jpg'),
  ('Four Cheese Pizza',    '/food_images/pizza-cheese.jpg'),
  ('Spaghetti Bolognese',  '/food_images/pasta-spaghetti-bolognese.jpg'),
  ('Double Bacon Burger',  '/food_images/burger-double-cheese.jpg'),
  ('Mango Smoothie',       '/food_images/drink-smoothie.jpg'),
  ('Fresh Orange Juice',   '/food_images/drink-fruit-mocktail.jpg')
) as v(name, image)
where f.name = v.name;

-- -----------------------------------------------------------------------------
-- Part 2: add dishes for the photos that had no dish on the menu
--         (fried chicken, fries, milkshake, slush, sundae)
--         Guarded with NOT EXISTS so re-running never creates duplicates.
-- -----------------------------------------------------------------------------
insert into public.foods (name, description, price, discount_percentage, image, category_id, available)
select v.name, v.description, v.price, 0, v.image, c.id, true
from (values
  ('Crispy Fried Chicken', 'Golden buttermilk-fried chicken, crunchy outside and juicy inside.',
     12.00, '/food_images/fried-chicken.jpg',            'BBQ'),
  ('French Fries',         'Hot, salted fries served with ketchup and garlic mayo.',
      4.00, '/food_images/side-french-fries.jpg',        'Starters'),
  ('Chocolate Sundae',     'Chocolate ice cream with brownie pieces, cream and a cherry.',
      5.50, '/food_images/dessert-chocolate-sundae.jpg', 'Desserts'),
  ('Classic Milkshake',    'Chocolate, vanilla or strawberry, topped with whipped cream.',
      5.50, '/food_images/drink-milkshake.jpg',          'Drinks'),
  ('Watermelon Slush',     'Frozen watermelon blended with fresh lime and mint.',
      4.00, '/food_images/drink-watermelon-slush.jpg',   'Drinks')
) as v(name, description, price, image, category)
join public.categories c on c.name = v.category
where not exists (select 1 from public.foods x where x.name = v.name);

commit;

-- =============================================================================
-- Part 3 (OPTIONAL) - two leftover test rows have broken images:
--
--   'ch'    -> /image/ch.jpg   (that folder no longer exists, and the price is 270.00)
--   'pizza' -> a Pinterest page link, which is a web page and can never load
--
-- They are NOT deleted automatically. To remove them, run:
--
--   delete from public.foods where name in ('ch', 'pizza');
--
-- =============================================================================

-- =============================================================================
-- Check the result:
--   select name, image from public.foods
--   where image like '/food_images/%' order by name;
--   -- expected: 12 rows
--
--   select count(*) from public.foods;   -- expected: 48 (43 + 5 new)
-- =============================================================================
