# Job types

Jobs types available in system.

<!-- prettier-ignore -->
  - [CleanRedisStore](#cleanredisstore)
  - [CleanStorageFiles](#cleanstoragefiles)
  - [LanguageSyncTranslations](#languagesynctranslations)
  - [LocaleCopyPairwiseAssociations](#localecopypairwiseassociations)
  - [NutrientTableImportData](#nutrienttableimportdata)
  - [NutrientTableImportMapping](#nutrienttableimportmapping)
  - [PurgeRefreshTokens](#purgerefreshtokens)
  - [SendPasswordReset](#sendpasswordreset)
  - [SurveyDataExport](#surveydataexport)
  - [SurveyExportRespondentAuthUrls](#surveyexportrespondentauthurls)
  - [SurveyImportRespondents](#surveyimportrespondents)
  - [SurveyRequestHelp](#surveyrequesthelp)
  - [SurveyRespondentFeedback](#surveyrespondentfeedback)
  - [SurveySubmission](#surveysubmission)
  - [SurveySubmissionNotification](#surveysubmissionnotification)

## CleanRedisStore

`CleanRedisStore` wipes the specific redis stores. e.g. `cache` or `session`

## CleanStorageFiles

`CleanStorageFiles` wipes temporary storage files, e.g. `downloads` and `uploads` folders.

## LanguageSyncTranslations

`LanguageSyncTranslations` synchronizes database language translation records with built-in English translation.

:::tip Built-in translations update
This needs to be run if object structure changes, so all database records are synced to use same structure.
:::

## LocaleCopyPairwiseAssociations

`LocaleCopyPairwiseAssociations` copies pairwise associations data from source locale to target locale.

## NutrientTableImportData

`NutrientTableImportData` imports data from CSV file containing nutrient data.

## NutrientTableImportMapping

`NutrientTableImportMapping` imports Excel-based nutrient mappings from CSV file.

## PurgeRefreshTokens

`PurgeRefreshTokens` clean expired refresh tokens, that don't need to be hold in database store anymore.

## SendPasswordReset

`SendPasswordReset` is triggered when user requests password reset.

## SurveyDataExport

`SurveyDataExport` survey submission data to CSV file based on scheme-defined export columns.

## SurveyExportRespondentAuthUrls

`SurveyExportRespondentAuthUrls` survey respondent authentication details (usernames and authentication URLs).

## SurveyImportRespondents

`SurveyImportRespondents` imports survey respondent records from provided CSV file.

**Available columns**

| Column   | Description | Record          |
| -------- | ----------- | --------------- |
| username | Required    | UserSurveyAlias |
| password | Required    | UserPassword    |
| name     | Optional    | User            |
| email    | Optional    | User            |
| phone    | Optional    | User            |
| \*       | Optional    | UserCustomField |

:::tip User custom fields
Any additional column not listed above, will get stored as `UserCustomField` record, which is `key` -> `value` record in database table.
:::

## SurveyRequestHelp

`SurveyRequestHelp` sends request help email to study support users.

## SurveyRespondentFeedback

`SurveyRespondentFeedback` sends email with attached survey feedback PDF file to provided email address.

## SurveySubmission

`SurveySubmission` processes submission state and saves to data.

## SurveySubmissionNotification

`SurveySubmissionNotification` is used with webhook to dispatch survey submission notification.

When valid `Submission notification URL` is set in survey settings, webhook is automatically called with each successful submission. Submission data are attached in request body.

If survey settings specify JWT secret, signed JWT token is attached as Bearer in `Authorization` header of the request.

Request

```json
POST https://my-submission-notification-url.example.com

Authorization: Bearer {token}
Content-Type: application/json

{
    ...
}
```
