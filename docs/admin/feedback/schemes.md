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
