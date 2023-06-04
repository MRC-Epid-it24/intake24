# Feedback schemes

Feedback output is defined by feedback scheme, which has couple of sections.

## Detail

Detail tab displays selected feedback scheme info.

## Create / Edit

Edit tab allows to modify selected feedback scheme.

- `Name` - `feedback-scheme-wide` unique name

- `Type` - Placeholder at the moment for future to allow to define various types of feedback schemes

- `Outputs` - List of outputs that are allowed / offered to user. Possible outputs are `print`, `download` and `email`.

- `Physical data inputs` - List of physical data inputs / identifiers, which are required to be collected for feedback calculation

- `Sections` - List of feedback sections to be included in feedback

  - drag & drop re-ordering of sections
  - tick / untick to include / exclude section from feedback

  - available sections are:
    - `topFoods` - Top foods
    - `cards` - Feedback cards
    - `meals` - Meals per-day breakdown

## Top foods

Settings to populate top foods feedback section. It controls top foods lists and nutrient composition pie charts.

### Number of foods

- allows to set number of top foods to display + rest as `other food`
- preferred colors can be assigned to each food, which will be displayed both in lists & pie charts

### Nutrient types

- list of nutrient types to be displayed, which translates to number of lists & pie charts per nutrient type

## Cards

List of cards to be included in feedback.

There are couple of feedback card types that can be used:

- `Character` - Assigns nutrient types, which gets matched with demographic groups.

- `Nutrient group` - Allows to define group of nutrients & thresholds to provide aggregated intake.

- `Five a day` - Defines `five-a-day` feedback for fruit & vegetables.

## Demographic groups

List of demographic groups definitions, which are used for matching with `character` cards based on the defined criteria.

## Henry coefficients

List of Henry coefficients used for calculations (BMR etc).

## Meals per-day breakdown

Meals per-day breakdown statistics.

### Chart breakdown

Meal per-day breakdown chart for selected nutrient type(s).

- `Colors` - list of colors to use for meal chart

- `Nutrient types` - list of nutrient types groups, displayed chart per nutrient type group

### Table breakdown

Meal per-day breakdown table with selected meal specific fields.

List of columns to be displayed in meal per-day breakdown table. List can be re-ordered by drag & drop.

1. There are common field properties for all field types:

- `header` - localized column header name

- `value` - localized field value

:::tip Value formatting
If field value is empty, then field value is display as is. If additional formatting is needed, use `{value}` placeholder to display field value.
:::

- `type` - field type, possible values `standard`, `custom` or `nutrient`

2. Depending on selected field type, there are additional properties to be set:

- `fieldId` - field id, which is used to match with meal specific field

#### `Standard` field IDs

- `Name` - Meal name (Breakfast, Lunch, Dinner, Snack, ...)
- `Time` - Meal time to display (HH:MM)
- `Hours` - Hours part of meal time to display (HH)
- `Minutes` - Minutes part of meal time minutes to display (MM)
- `Duration` - Meal duration in minutes

#### `Custom` field IDs

When `custom` field type is selected, `fieldId` must be set to match specific `meal prompt ID` from selected `survey scheme`.

#### `Nutrient` field IDs

When `nutrient` field type is selected, `fieldId` is generated automatically based on selected `nutrient type` list.
