# Locales

Locale is a grouping record to hold a specific list of categories / foods and its inheritance.

## Detail tab

Detail tab displays selected locale.

## Create / Edit tab

Edit tab allows to modify selected locale.

- `Locale ID` - short, unique and valid locale ID.

- `Prototype locale ID` - prototype locale it inherits foods data from.

- `English name` - english name of the language (e.g. Czech).

- `Local name` - local name of the language (e.g. Čeština).

- `Country flag code` - country code to select correct flag. (`DEPRECATED - moved to language settings`)

- `Text direction` - read/write direction of text. Valid options are `ltr` or `rlt`. (`DEPRECATED - moved to language settings`)

## Deletion

Locale deletion won't be permitted if there are surveys using it. User firstly needs to be re-assign the surveys to use different locale.
