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

## Prompts

Prompts tab allows to design dietary survey recall flow and define details about each prompt asked.

Prompts are categorized to sections and they are asked in specified fixed order. See table below.

### Recall sections

| Name          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| 1. Pre-meal   | Prompts asked about whole recall before dietary data entered |
| 2. Pre-foods  | Prompts asked about meal before foods were entered           |
| 3. Foods      | Prompts asked about the foods                                |
| 4. Post-foods | Prompts asked about meal after foods were entered            |
| 5. Post-meal  | Prompts asked about whole recall after dietary data          |
| 6. Submission | Prompts asked during data submissions                        |

Whole prompt sections group can be loaded from another scheme using `load from scheme` button.

When prompt section is selected, list of prompts appear below:

- New prompts can be added
- Prompts can be removed
- List of prompts can be re-arranged by drag & drop
- Prompt can be loaded from `template` defined in `scheme prompts` section
- Prompt can be saved as `template` if it doesn't exist yet (determined by unique `prompt id`)
- Prompt's settings can be synced from `template` if it exists (determined by unique `prompt id`)

## Data export

Data export tab allows to define fields, which will get exported to flattened CSV file having `food-per-row` with all additional fields.

There is a fixed list of possible data export sections

### Sections

| Name                     | Description |
| ------------------------ | ----------- |
| User record fields       |             |
| User custom fields       |             |
| Survey record fields     |             |
| Submission record fields |             |
| Submission custom fields |             |
| Meal record fields       |             |
| Meal custom fields       |             |
| Food record fields       |             |
| Food custom fields       |             |
| Food composition fields  |             |
| Food nutrient fields     |             |
| Portion size fields      |             |

Sections can be re-arranged by drag & drop and they will appear accordingly in export file.

Each section can be edited. Screen is divided in half to show included fields on left and available fields for inclusion on right.

Each field has:

- `Field ID` - unique field identifier to internal link the data
- `Field label` - customizable CSV column header in export file

#### User record fields

- `userId` - unique user identifier, sequence number
- `name` - user name
- `simpleName` - transformed user name, stripped off any diacritic / accent characters
- `email` - user email
- `phone` - user phone number

#### User custom fields

User custom fields are key-value pairs, set up during respondent account creation.

#### Survey record fields

- `surveyId` - unique survey identifier, sequence number
- `username` - survey-unique respondent identifier attached to both user and survey record (aka `user survey alias`)

#### Submission record fields

- `submissionId` - unique submission identifier, UUIDv4
- `startTime` - client-recorded recall start time, ISO 8601 format
- `endTime` - client-recorded recall end time, ISO 8601 format
- `submissionTime` - server-recorded submission time, ISO 8601 format
- `recallDuration` - recall duration in mins (rounded to whole number using `truncate`)
- `userAgent` - client device raw user agent header
- `browser` - client device browser name (user-agent parsed)
- `engine` - client device browser engine name (user-agent parsed)
- `device` - client device name (user-agent parsed)
- `os` - client device operating system name (user-agent parsed)
- `cpu` - client device CPU architecture (user-agent parsed)

#### Submission custom fields

Submission-level custom data collected during the recall.

- `Field ID` is the unique `Prompt ID` set up in scheme prompts section

#### Meal record fields

- `mealIndex` - zero-based meal index in the recall generated during data-export based on meal time
- `mealId` - unique meal identifier, UUIDv4
- `name` - meal name
- `time` - meal time (HH:mm)
- `duration` - meal duration (mins)

#### Meal custom fields

Meal-level custom data collected during the recall.

- `Field ID` is the unique `Prompt ID` set up in scheme prompts section

#### Food record fields

Contains `encoded food` and `missing food` records data

- `foodIndex` - zero-based food index within a meal (includes encoded food and missing food records)
- `foodId` - unique food identifier, UUIDv4
- `parentId` - unique food identifier of parent food, UUIDv4
- `code` - Food code
- `englishName` - Food name (English)
- `localName` - Food name (local)
- `readyMeal` - Flag indicating if food is ready meal
- `searchTerm` - Search term used to find the food
- `reasonableAmount` - Flag indicating if food amount is reasonable
- `foodGroupId` - Food group identifier, sequence number
- `foodGroupEnglishName` - Food group name (English)
- `foodGroupLocalName` - Food group name (local)
- `brand` - Food brand
- `nutrientTableId` - Nutrient table identifier
- `nutrientTableCode` - Nutrient table code

- `missingId` - unique missing food identifier, UUIDv4
- `missingParentId` - unique food identifier of parent food, UUIDv4
- `missingName` - Missing food name
- `missingBrand` - Missing food brand
- `missingDescription` - Missing food description
- `missingPortionSize` - Missing food portion size
- `missingLeftovers` - Missing food leftovers

#### Food custom fields

Food-level custom data collected during the recall.

- `Field ID` is the unique `Prompt ID` set up in scheme prompts section

#### Food composition fields

List of available food composition fields from nutrient table

#### Food nutrient fields

List of available nutrient type fields

#### Portion size fields

List of portion size fields based on collection portion size methods

- `servingWeight` - Food weight in grams
- `leftoversWeight` - Leftovers weight in grams
- `portionWeight` - Calculated portion weight (`servingWeight` - `leftoversWeight`)
