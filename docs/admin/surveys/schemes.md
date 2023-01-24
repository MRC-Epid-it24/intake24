# Survey schemes

Survey recall flow is defined by scheme, which has couple of sections.

## Detail

Detail tab displays selected survey scheme info.

## Create / Edit

Edit tab allows to modify selected survey scheme.

- `Name` - `survey-scheme-wide` unique name

- `Type` - Placeholder at the moment for future to allow to define various types of survey schemes

- `Default meals` - List of predefined meals that will appear at the start of the recall.

  - It allows to:
    - Create new meals with default time and localized name
    - Remove meals
    - Load whole meal list from different scheme
    - Reset the list to default one

## Questions

Questions tab allows to design dietary survey recall flow and define details about each question asked.

Questions are categorized to sections and they are asked in specified fixed order. See table below.

### Recall sections

| Name          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| 1. Pre-meal   | Questions asked about whole recall before dietary data entered |
| 2. Pre-foods  | Questions asked about meal before foods were entered           |
| 3. Foods      | Questions asked about the foods                                |
| 4. Post-foods | Questions asked about meal after foods were entered            |
| 5. Post-meal  | Questions asked about whole recall after dietary data          |
| 6. Submission | Questions asked during data submissions                        |

Whole question sections group can be loaded from another scheme using `load from scheme` button.

When question section is selected, list of questions appear below:

- New questions can be added
- Questions can be removed
- List of questions can be re-arranged by drag & drop
- Question can be loaded from `template` defined in `scheme questions` section
- Question can be saved as `template` if it doesn't exist yet (determined by unique `question id`)
- Question's settings can be synced from `template` if it exists (determined by unique `question id`)

## Data export

Data export tab allows to define fields, which will get exported to flattened CSV file having `food-per-row` with all additional fields.

There is a fixed list of possible data export sections

### Sections

| Name                    | Description |
| ----------------------- | ----------- |
| User record fields      |             |
| User custom fields      |             |
| Survey record fields    |             |
| Survey custom fields    |             |
| Meal record fields      |             |
| Meal custom fields      |             |
| Food record fields      |             |
| Food custom fields      |             |
| Food composition fields |             |
| Food nutrient fields    |             |
| Portion size fields     |             |

Sections can be re-arranged by drag & drop and they will appear accordingly in export file.

Each section can be edited. Screen is divided in half to show included fields on left and available fields for inclusion on right. `Field name` can be modified and will get used as column header in export file.
