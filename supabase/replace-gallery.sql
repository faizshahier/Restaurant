-- =============================================================================
-- REPLACE THE GALLERY  —  clear every row, then load the new photos
-- =============================================================================
-- Photos come from public/R_images/, which Vite serves at /R_images/...
-- so the paths below work in development and in the production build.
--
-- The old gallery held 21 rows of unusable data: "[DEMO]" titles, dead
-- picsum.photos links, four rows with an EMPTY image_url, and one Pinterest
-- page link (a web page, not an image). All of it is replaced here.
--
-- Only the gallery table is touched. Foods, categories, orders and settings
-- are left exactly as they are.
--
-- Run once in the Supabase SQL Editor.
-- =============================================================================

begin;

-- 1. Clear the old gallery. Nothing references this table, so a plain delete
--    is safe — no foreign keys point at it.
delete from public.gallery;

-- 2. The new photos, with proper gallery titles.
insert into public.gallery (image_url, title) values
  ('/R_images/open-kitchen.jpg',     'Our Open Kitchen'),
  ('/R_images/main-dining-room.jpg', 'The Main Dining Room'),
  ('/R_images/candlelit-table.jpg',  'Candlelit Evenings'),
  ('/R_images/sunset-terrace.jpg',   'Sunset on the Terrace');

commit;

-- =============================================================================
-- Check the result:
--   select title, image_url from public.gallery order by title;
-- =============================================================================
