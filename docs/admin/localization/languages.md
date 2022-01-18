# Languages

Intake24 bundles by default on English default texts. Additional languages can be defined in following sections.

Languages are then associated with locales and they in list of available languages in frontend UI (`admin tool` or `survey recall`).

## Detail tab

Detail tab displays selected language info.

## Create / Edit tab

Edit tab allows to modify selected language.

- `Language ID` - valid locale ID and unique string within `language` records

- `Country flag code` - Country code to select correct flag

- `English name` - English name of the language (e.g. Czech)

- `Local name` - Local name of the language (e.g. Čeština)

- `Text direction` - Read / write direction of text. Valid options are `ltr` or `rlt`

## Translations

When new language is created, default translations for frontend applications are copied to language record and can be modified / localized to the desired language.

Translations tab shows the list of `application - section` records, which contains `key -> value` translations. These can be modified / localized.

When user visits frontend application or manually changes language in user profile, it fetches available languages from server, so they get updated translations

:::tip Built-in translations updates

If default built-in translations structure was modified, job `SyncLanguageTranslations` should be triggered / run. It updates all language translations to up-to-date structure.

It can potentially result in data loss in predicted way. Translation files are simple `js` object literals / json.

See below example of when original in-built structure was simple string and new translation got expanded and became object of strings. New object is taken and original string removed -> this translation then gets discarded and new object with all it's keys (and default English values) needs to be translated.

```js
// original translation
{
    section: 'Section',
}

// new translation
{
    section: {
        title: 'Section',
        content: 'Content',
    }
}
```
:::

## Deletion

Language deletion won't be permitted if there are locales using it. User firstly needs to be re-assign the locales to use different language.
