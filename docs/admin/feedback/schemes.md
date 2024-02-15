# Feedback schemes

## Introduction

The functions in [Feedback schemes](/admin/feedback/schemes) allow dietary feedback to be customised.
It is recommended to start with an existing feedback scheme, which can be adapted.

The `PREVIEW` button can be used to view changes during the customisation process.

## Detail

Detail tab displays selected feedback scheme info.

## Edit

Edit tab allows modification of selected feedback scheme.

- `Name` - `feedback-scheme-wide` unique name

- `Type` - Placeholder to allow different types of feedback schemes in the future

- `Visibility` - Record visibility, valid options are `public` or `restricted` ([record visibility](/admin/acl/securables.html#record-visibility)).

- `Outputs` - List of outputs that are allowed / offered to user. Possible outputs are `print`, `download` and `email`.

- Physical data fields - List of physical data inputs / identifiers, which are required to be collected for feedback calculation for some outputs:

  - `Sex` - required if feedback is sex specific

  - `Weight`, `Height`, `Physical activity level` and `Weight target` required if feedback is intended to provide an indication of whether energy/calorie intake is 'high' or 'low' etc.

  - `Weight` similar to above required for feedback in meeting protein requirements

  - `Birth date` required for age specific feedback

- `Sections` - LList of feedback sections included in feedback

  - drag & drop re-ordering of sections
  - tick / untick to include / exclude section from feedback

  - available sections are:

    - `topFoods` – shows top foods contributing to selected nutrient intake as pie charts

    - `cards` – shows intake of selected nutrients, energy and foods

    - `meals` – shows information on e.g. contribution to total energy intake from meals

    - `rating` - 5-star rating with optional comment to be submitted by user

## Top foods

Settings to populate top foods feedback section. It controls top foods lists and nutrient composition pie charts.

### Number of foods

- allows to set number of top foods to display, remaining foods will be grouped as other food

- preferred colors can be assigned to each food, which will be displayed both in lists & pie charts

### Nutrient types

- list of nutrient types to be displayed, which translates to number of lists & pie charts per nutrient type

## Meals

Sets breakdown statistics per day for meals.

### Meal breakdown chart

Sets pie charts for meal contribution to selected nutrient type(s).

- `Meal colors` – preferred colors can be assigned for each meal
- `Nutrient types` - list of nutrient types to be displayed

### Meal summary table

Meal per-day breakdown table with selected meal specific fields.
List of columns to be displayed in meal per-day breakdown table. List can be re-ordered by drag & drop.

1. There are common field properties for all field types:

   - `header` - localized column header name

   - `value` - localized field value
     :::tip Value formatting
     If field value is empty, then field value is displayed as is. If additional formatting is needed, use `{value}` placeholder to display field value.
     :::

   - `type` - field type, possible values standard, custom or nutrient

2. Depending on selected field type, there are additional properties to be set:

   - `fieldId` - field id, which is used to match with meal specific field

**Standard field IDs**

- `Name` - Meal name (Breakfast, Lunch, Dinner, Snack, ...)
- `Time` - Meal time to display (HH:MM)
- `Hours` - Hours part of meal time to display (HH)
- `Minutes` - Minutes part of meal time minutes to display (MM)
- `Duration` - Meal duration in minutes

**Custom field IDs**

When `custom` field type is selected, `fieldId` must be set to match specific `meal prompt ID` from selected `survey scheme`.

**Nutrient field IDs**

When nutrient field type is selected, fieldId is generated automatically based on selected nutrient type list.

## Cards

List of cards (selected nutrients, foods, energy) to be included in feedback.

There are couple of feedback card types that can be used:

- `Character` – Assigns a nutrient type, which needs to be matched with nutrient type in `demographic groups` to display in feedback.

  - `Content` – `Character type` selects image that displays in feedback, `Nutrient type` selects nutrient, food or energy variable

- `Nutrient group` - Allows grouping of nutrients (e.g. fatty acids or sugar types) & thresholds to provide aggregated intake.

  - `Content` allows editing of card name and ‘Tell me more’ text to be entered.
  - `Unit` enter measure such as ‘grams’, ‘mg’ etc.
  - `Thresholds` sets lower or upper limits, with message
  - `Nutrients` groups variables together for feedback

- `Five a day` - Defines `five-a-day` feedback for fruit & vegetables.

## Demographic groups

List of demographic groups definitions, used for matching with character cards based on the defined criteria.
Demographic groups can be edited or new ones created. In `Edit demographic group` or `New demographic group`:

### General

Allows selection of:

- `Nutrient type`

- `Nutrient rule type`: allows how nutrients are calculated and presents feedback based on consumption as follows:

  - `Energy divided by BMR`: energy intake divided by BMR, fitting to optimal intake (e.g. energy/calorie intake compared to recommendations)
  - `Percentage of energy`: contribution of the nutrient to energy intake (e.g. percent contribution of fat to total energy intake)
  - `Per unit of weight`: contribution of the nutrient per kg of body weight, fitting to optimal intake (e.g. protein intake per kg of body weight)
  - `Range`: Amount of nutrient consumed (e.g. grams of fibre)

- `Sex` allows sex specific content for feedback (e.g. iron recommendations)

- `Age` set age range to align with age specific dietary/nutrient recommendations

### Scale sectors

Allows addition of detailed feedback in the `Description` box. `ADD SCALE SECTOR` allows addition of customised feedback based on a range of intakes e.g. 'low' or 'high'. `Range` and `Sentiment` need to be set.

## Henry coefficients

List of Henry coefficients used to calculate BMR which underpins some of the feedback calculations.

## Security

Record-level access for other researchers to edit feedback sections
