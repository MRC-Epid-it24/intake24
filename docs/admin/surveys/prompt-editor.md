# Prompt editor

Full screen modal opens when `add` or `edit` button is clicked.

Top level toolbar has:

- `Cancel` button on the left - prompt changes are discarded
- `Confirm` button on the right - prompt changes are confirmed, but not yet saved to server's database
- Tab list with:
  - `General` - Prompt type & id & name of the prompt `internal-only` purposes
  - `Content` - Localized prompt content fields
  - `Conditions` - Conditions list to be met to display the prompt
  - `Validation` - Validation options, i.e. prompt is optional or required
  - `Options` - Additional per-prompt type options

## General

General tab defines administrative fields

- `Type` - Prompts are categorized to three types:

  - [custom prompts](/admin/surveys/prompt-types#custom-prompts)
  - [standard prompts](/admin/surveys/prompt-types#standard-prompts)
  - [portion size prompts](/admin/surveys/prompt-types#portion-size-prompts)

- `ID` - `scheme-unique` ID assigned to prompt

::: tip Prompt ID usage

- Prompt ID of custom prompt is used as identifier in data exports file. It is also used to identify prompt in the scheme.
- Prompt ID is used to load prompt from `template` and to sync prompt properties from `template`.
  :::

- `Name` - User friendly name for easier orientation (for internal use only).

## Content

Content tab defines respondent facing content text fields and their localized versions.

- `Name` - Short prompt name displayed in top breadcrumbs component
- `Text` - Text displayed in the header component (usually defaults to meal name for meal-level prompts and to food name for food-level prompts)
- `Description` - Main body of prompt details, which allows to embed `rich-text` content

All fields can be localized to [languages](/admin/localization/languages) set up in the database.

Following variables can be used in the fields:

- `{meal}` - Meal name & time
- `{mealName}` - Meal name
- `{mealTime}` - Meal time
- `{food}` - Food name
- `{item}` - Food name or Meal name depending on prompt level type

## Conditions

Conditions tab defines list of conditions that needs to be met to display the prompt.

- If conditions is empty, prompt is always displayed.
- If conditions is not empty, prompt is only displayed once all conditions are met.

### Operations

Each condition can be defined by following operations:

| Operation | Value type         | Description                                                  |
| --------- | ------------------ | ------------------------------------------------------------ |
| `eq`      | string \| string[] | Prompt answer equals to defined value                        |
| `nt`      | string \| string[] | Prompt answer does not equal to defined value                |
| `in`      | string \| string[] | One of the prompt answers is included defined value-list     |
| `notIn`   | string \| string[] | None of the prompt answers is included in defined value-list |
| `gte`     | number             | Prompt answer is greater than or equals to defined value     |
| `gt`      | number             | Prompt answer is greater than defined value                  |
| `lte`     | number             | Prompt answer is lower than or equals to defined value       |
| `lt`      | number             | Prompt answer is lower than defined value                    |

## Validation

Validation tab defines validation options, i.e. whether prompt is optional or required.

## Options

Options tab defines additional per-prompt type options. See [Prompt types](/admin/surveys/prompt-types) for more details.
