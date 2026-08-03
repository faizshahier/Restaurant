-- =============================================================================
-- REPLACE THE MENU  —  delete every food + category, then load the new menu
-- =============================================================================
-- Images come from public/food_images/, which Vite serves at /food_images/...
-- so the paths below work in both development and the production build.
--
-- DESTRUCTIVE: this removes all existing foods and categories.
-- Checked before writing: the database had 43 foods, 11 categories, and
-- 0 orders / 0 order_items — so no order history is affected.
--
-- (If orders ever do exist, deleting a food only sets order_items.food_id to
-- NULL. The food_name and price are stored as snapshots on the order line, so
-- past orders stay complete and readable.)
--
-- The gallery and settings tables are NOT touched.
--
-- Run once in the Supabase SQL Editor.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Clear the old menu.
--    Foods must go first: categories use ON DELETE RESTRICT, so a category
--    cannot be removed while a food still points at it.
-- -----------------------------------------------------------------------------
delete from public.foods;
delete from public.categories;

-- -----------------------------------------------------------------------------
-- 2. Categories — only the ones that actually have a photo.
-- -----------------------------------------------------------------------------
insert into public.categories (name) values
  ('Pizza'),
  ('Burgers'),
  ('Fried Chicken'),
  ('Pasta'),
  ('Sides'),
  ('Desserts'),
  ('Drinks');

-- -----------------------------------------------------------------------------
-- 3. Foods — every item below has a real photo in public/food_images/.
--    Joined to categories by name so the category ids never need hard-coding.
-- -----------------------------------------------------------------------------
insert into public.foods (name, description, price, discount_percentage, image, category_id, available)
select v.name, v.description, v.price, v.discount, v.image, c.id, true
from (values
  -- Pizza
  ('Pepperoni Pizza',      'Loaded with pepperoni and melted mozzarella on a hand-stretched base.',
     11.00, 0,  '/food_images/pizza-pepperoni.jpg',           'Pizza'),
  ('Supreme Pizza',        'Pepperoni, mushrooms, olives, peppers and red onion.',
     12.50, 10, '/food_images/pizza-supreme.jpg',             'Pizza'),
  ('Cheese Pizza',         'Stretchy mozzarella with sweet peppers and herbs.',
      9.50, 0,  '/food_images/pizza-cheese.jpg',              'Pizza'),

  -- Burgers
  ('Double Cheeseburger',  'Two beef patties, melted cheddar, tomato and fresh greens.',
     10.50, 0,  '/food_images/burger-double-cheese.jpg',      'Burgers'),

  -- Fried Chicken
  ('Crispy Fried Chicken', 'Golden buttermilk-fried chicken, crunchy outside and juicy inside.',
     12.00, 0,  '/food_images/fried-chicken.jpg',             'Fried Chicken'),

  -- Pasta
  ('Spaghetti Bolognese',  'Slow-cooked beef ragu with parmesan and fresh basil.',
     10.00, 0,  '/food_images/pasta-spaghetti-bolognese.jpg', 'Pasta'),

  -- Sides
  ('French Fries',         'Hot, salted fries with ketchup and garlic mayo.',
      4.00, 0,  '/food_images/side-french-fries.jpg',         'Sides'),

  -- Desserts
  ('Chocolate Sundae',     'Chocolate ice cream, brownie pieces, cream and a cherry.',
      5.50, 0,  '/food_images/dessert-chocolate-sundae.jpg',  'Desserts'),

  -- Drinks
  ('Fresh Fruit Mocktail', 'Chilled fruit juice over ice with mint and citrus.',
      4.50, 0,  '/food_images/drink-fruit-mocktail.jpg',      'Drinks'),
  ('Fruit Smoothie',       'Thick blended fruit smoothie, made fresh to order.',
      5.00, 0,  '/food_images/drink-smoothie.jpg',            'Drinks'),
  ('Classic Milkshake',    'Chocolate, vanilla or strawberry, topped with cream.',
      5.50, 0,  '/food_images/drink-milkshake.jpg',           'Drinks'),
  ('Watermelon Slush',     'Frozen watermelon blended with lime and mint.',
      4.00, 0,  '/food_images/drink-watermelon-slush.jpg',    'Drinks')
) as v(name, description, price, discount, image, category)
join public.categories c on c.name = v.category;

commit;

-- =============================================================================
-- Check the result:
--   select c.name as category, f.name as dish, f.price, f.image
--   from public.foods f join public.categories c on c.id = f.category_id
--   order by c.name, f.name;
-- =============================================================================
