# Guide images

Guide images are enhanced records of corresponding `image map`. They allow to assign localized labels and weights to each of the object defined in [Image map record](/admin/images/image-maps).

## Detail

Detail tab displays selected image map info.

## Create / Edit

Edit tab allows to modify selected image map.

- `Guide image ID` - Unique string within `guide image` records

- `Description` - Free text to describe the guide image

- `Image map` - Select image maps to build guide image

### Object area editor

After record is created, existing object areas can be assigned with:

- `Weight` - object's weight in grams

- `Label` - object's localized label, display on hover/selection

:::tip Label settings
**Display** - Labels are displayed only when enabled in [guide-image-prompt](/admin/surveys/question-types#guide-image-prompt)

**Formatting** - Weight can be embedded into the label with `{weight}` variable placeholder.
:::

## Deletion

Make sure that guide image is not assigned to any of the portion size methods.
