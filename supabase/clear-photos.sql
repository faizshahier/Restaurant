-- =============================================================================
-- CLEAR ALL PHOTOS  —  menu keeps its dishes, gallery is emptied
-- =============================================================================
-- What this does:
--   * Every food keeps its name, description, price, discount and category.
--     Only the photo is removed, so each dish shows "Photo coming soon".
--   * Every gallery row is deleted, because a gallery entry without a photo has
--     nothing left to show.
--
-- Not touched: categories, orders, order_items, settings.
--
-- Note on the empty value: foods.image is `text not null`, so the "no photo"
-- value is an empty string, not NULL. The UI treats an empty string as
-- "no image" and falls back to the placeholder.
--
-- Run once in the Supabase SQL Editor.
-- =============================================================================

begin;

-- 1. Remove every menu photo, keeping the dishes themselves.
update public.foods
set image = ''
where image <> '';

-- 2. Empty the gallery.
delete from public.gallery;

commit;

-- =============================================================================
-- Check the result:
--   select count(*) as foods_with_a_photo from public.foods where image <> '';
--   -- expected: 0
--
--   select count(*) as gallery_rows from public.gallery;
--   -- expected: 0
--
--   select count(*) as dishes_still_on_the_menu from public.foods;
--   -- expected: unchanged (43)
-- =============================================================================
