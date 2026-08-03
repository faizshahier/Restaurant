-- =============================================================================
-- ADD YOUR OWN GALLERY PHOTOS  (from public/R_images/)
-- =============================================================================
-- The gallery already had four rows with a proper title but an EMPTY image_url,
-- and their titles match the four photos almost exactly. So this fills those
-- rows in rather than creating near-duplicate entries:
--
--   'Our Open Kitchen'      <- the kitchen photo
--   'The Dining Room'       <- the warm dining room
--   'Evenings on the Patio' <- the sunset terrace
--   'A Freshly Plated Dish' <- the candlelit table setting
--
-- Vite serves public/R_images/ at /R_images/, so these paths work in
-- development and in the production build.
--
-- The other gallery rows are left untouched. Foods, categories, orders and
-- settings are not affected.
--
-- Run once in the Supabase SQL Editor.
-- =============================================================================

begin;

update public.gallery as g
set image_url = v.image_url
from (values
  ('Our Open Kitchen',      '/R_images/open-kitchen.jpg'),
  ('The Dining Room',       '/R_images/main-dining-room.jpg'),
  ('Evenings on the Patio', '/R_images/sunset-terrace.jpg'),
  ('A Freshly Plated Dish', '/R_images/candlelit-table.jpg')
) as v(title, image_url)
where g.title = v.title;

commit;

-- =============================================================================
-- Check the result:
--   select title, image_url from public.gallery
--   where image_url like '/R_images/%' order by title;
--   -- expected: 4 rows
--
--   select count(*) as rows_still_missing_a_photo
--   from public.gallery where coalesce(image_url, '') = '';
--   -- expected: 0
-- =============================================================================

-- =============================================================================
-- OPTIONAL - the 16 '[DEMO] ...' rows and the row titled 'food' are leftover
-- sample data. They are NOT removed automatically. To clear them and leave only
-- your four real photos:
--
--   delete from public.gallery
--   where title like '[DEMO]%' or title = 'food';
--
-- =============================================================================
