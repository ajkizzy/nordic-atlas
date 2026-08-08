with parsed as (
  select
    id,
    lower(
      btrim(
        split_part(
          split_part((regexp_match(notes, 'Original categories:\s*([^\.\n]+)'))[1], ',', 1),
          '|',
          1
        )
      )
    ) as first_category
  from public.leads
  where source = 'wolt'
    and notes ~ 'Original categories:'
), classified as (
  select
    id,
    case
      when first_category = 'burger' then 'burger'::public.cuisine_type
      when first_category = 'bbq' then 'bbq'::public.cuisine_type
      when first_category in ('fast food', 'fastfood', 'chicken', 'american') then 'fastfood'::public.cuisine_type
      when first_category = 'sushi' then 'sushi'::public.cuisine_type
      when first_category in ('asian', 'chinese', 'thai') then 'asian'::public.cuisine_type
      when first_category = 'indian' then 'indian'::public.cuisine_type
      when first_category in ('kebab', 'middle eastern') then 'middle_eastern'::public.cuisine_type
      when first_category in ('pizza', 'italian') then 'pizza'::public.cuisine_type
      when first_category = 'sandwich' then 'sandwich'::public.cuisine_type
      when first_category = 'bakery' then 'bakery'::public.cuisine_type
      when first_category = 'deli' then 'deli'::public.cuisine_type
      when first_category in ('salad', 'vegan', 'vegetarian', 'healthy') then 'salad'::public.cuisine_type
      when first_category in ('cafe', 'breakfast', 'dessert') then 'cafe'::public.cuisine_type
      else 'other'::public.cuisine_type
    end as cuisine
  from parsed
  where first_category is not null
    and first_category <> ''
)
update public.leads as lead
set cuisine = classified.cuisine
from classified
where lead.id = classified.id
  and lead.cuisine is distinct from classified.cuisine;
