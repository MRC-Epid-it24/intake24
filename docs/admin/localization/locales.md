# Locales

Locale is a grouping record to hold a specific list of categories / foods and its inheritance.

## Detail

Detail tab displays selected locale.

## Create / Edit

Edit tab allows to modify selected locale.

- `Locale ID` - Valid locale ID and unique string within `locale` records

- `Prototype locale ID` - Prototype locale it inherits foods data from

- `English name` - English name of the language (e.g. Czech)

- `Local name` - Local name of the language (e.g. Čeština)

- `Country flag code` - Country code to select correct flag (`DEPRECATED - moved to language settings`)

- `Text direction` - Read / write direction of text. Valid options are `ltr` or `rlt` (`DEPRECATED - moved to language settings`)

## Deletion

Locale deletion won't be permitted if there are surveys using it. User firstly needs to update the surveys to use different locale.

## Split lists

Split list entries management

Entry has following fields:

- `First word` - first word
- `Words` - space delimited list of words

## Split words

Split words entries management

Entry has following fields:

- `Words` - space delimited list of words

## Synonym sets

Synonym sets entries management

Entry has following fields:

- `Synonyms` - space delimited list of synonyms
