# Question editor

Full screen modal opens when `add` or `edit` button is clicked.

Top level toolbar has:

- `Cancel` button on the left - changes are discarded
- `Confirm` button on the right - changes are confirmed, but not yet saved to server's database
- Tab list with:
  - `General` - Question type & id & name of the question `internal-only` purposes
  - `Content` - Localized question content fields
  - `Conditions` - Conditions list to be met to display the question
  - `Validation` - Validation options, i.e. question is optional or required
  - `Options` - Additional per-question type options

## General

General tab defines administrative fields

- `Type` - Question type that is asked. Questions are categorized to `custom`, `standard` and `portion size` groups
- `ID` - `scheme-unique` ID assigned to question
- `Name` - User friendly name for easier orientation (internal-only).

## Content

Content tab defines respondent facing content text fields and their localization.

- `Name` - Prompt short name top breadcrumb component
- `Text` - Text displayed in the header component (usually defaults to meal name for meal-level questions and to food name for food-level questions)
- `Description` - Further details, allows to embed `html` content through rich-text editor

All fields can be localized to various languages.

Following variable can be used in the fields:

- `{meal}` - Meal name & time
- `{mealName}` - Meal name
- `{mealTime}` - Meal time
- `{food}` - Food name
- `{item}` - Food name or Meal name depending on question level type

## Conditions

Conditions tab defines list of conditions that needs to be met to display the question.

- If conditions is empty, question is always displayed.
- If conditions is not empty, question is only displayed once all conditions are met.

### Operations

Each condition can be defined by following operations:

| Operation | Value type         | Description                                                  |
| --------- | ------------------ | ------------------------------------------------------------ |
| eq        | string \| string[] | Prompt answer equals to defined value                        |
| nt        | string \| string[] | Prompt answer does not equal to defined value                |
| in        | string \| string[] | One of the prompt answers is included defined value-list     |
| notIn     | string \| string[] | None of the prompt answers is included in defined value-list |
| gte       | number             | Prompt answer is greater than or equals to defined value     |
| gt        | number             | Prompt answer is greater than defined value                  |
| lte       | number             | Prompt answer is lower than or equals to defined value       |
| lt        | number             | Prompt answer is lower than defined value                    |

## Validation

Validation tab defines validation options, i.e. whether question is optional or required.

## Options

Options tab defines additional per-question type options. See [Question types](/admin/surveys/question-types) for more details.
