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

Content tab defines respondent facing content

- `Name` - Short name for frontend UI top breadcrumb component
- `Text` - Header/text to be asked
- `Description` - Further details, allows to embed `html` content through rich-text editor

All three fields can be localized to various languages

## Conditions

Conditions tab defines conditions that need to be met to display the question.

- If no conditions are defined, question is always displayed.
- If any conditions are defined, question is only displayed if all conditions are met.

## Validation

Validation tab defines validation options, i.e. whether question is optional or required.

## Options

Options tab defines additional per-question type options. See [Question types](/admin/surveys/question-types) for more details.
