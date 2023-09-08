# Job types

Jobs types available in system.

- [Job types](#job-types)
  - [CleanRedisStore](#cleanredisstore)
  - [CleanStorageFiles](#cleanstoragefiles)
  - [LanguageTranslationsSync](#languagetranslationssync)
  - [LocaleFoods](#localefoods)
  - [LocaleFoodNutrientMapping](#localefoodnutrientmapping)
  - [LocaleFoodRankingUpload](#localefoodrankingupload)
  - [LocalePopularitySearchCopy](#localepopularitysearchcopy)
  - [NutrientTableDataImport](#nutrienttabledataimport)
  - [NutrientTableMappingImport](#nutrienttablemappingimport)
  - [PopularitySearchUpdateCounters](#popularitysearchupdatecounters)
  - [PurgeRefreshTokens](#purgerefreshtokens)
  - [SurveyAuthUrlsExport](#surveyauthurlsexport)
  - [SurveyDataExport](#surveydataexport)
  - [SurveyFeedbackNotification](#surveyfeedbacknotification)
  - [SurveyHelpRequestNotification](#surveyhelprequestnotification)
  - [SurveyNutrientsRecalculation](#surveynutrientsrecalculation)
  - [SurveyRespondentsImport](#surveyrespondentsimport)
  - [SurveySubmission](#surveysubmission)
  - [SurveySubmissionNotification](#surveysubmissionnotification)
  - [UserPasswordResetNotification](#userpasswordresetnotification)
  - [UserEmailVerificationNotification](#useremailverificationnotification)

## CleanRedisStore

`CleanRedisStore` wipes the specific redis stores. e.g. `cache` or `session`

```json
{
  "store": "cache" | "session"
}
```

## CleanStorageFiles

`CleanStorageFiles` wipes temporary storage files, e.g. `downloads` and `uploads` folders.

```json
{}
```

## LanguageTranslationsSync

`LanguageTranslationsSync` synchronizes database language translation records with built-in English translation.

:::tip Built-in translations update
This needs to be run if object structure changes, so all database records are synced to use same structure.
:::

```json
{}
```

## LocaleFoods

`LocaleFoods` exports foods data for selected locale.

```json
{
  "localeId": string,
}
```

## LocaleFoodNutrientMapping

`LocaleFoodNutrientMapping` exports food nutrient mapping data for selected locale.

```json
{
  "localeId": string,
}
```

## LocaleFoodRankingUpload

`LocaleFoodRankingUpload` uploads food ranking data for selected locale.

```json
{
  "localeId": string,
  "file": File
}
```

## LocalePopularitySearchCopy

`LocalePopularitySearchCopy` copies pairwise associations data from source locale to target locale.

```json
{
  "localeId": string,
  "sourceLocaleId": string
}
```

## NutrientTableDataImport

`NutrientTableDataImport` imports data from CSV file containing nutrient data.

```json
{
  "nutrientTableId": string,
  "file": File
}
```

## NutrientTableMappingImport

`NutrientTableMappingImport` imports Excel-based nutrient mappings from CSV file.

```json
{
  "nutrientTableId": string,
  "file": File
}
```

## PopularitySearchUpdateCounters

`PopularitySearchUpdateCounters` increments popularity search counters based on provided food codes from survey submission.

```json
{
  "localeCode": string,
  "foodCodes": string[]
}
```

## PurgeRefreshTokens

`PurgeRefreshTokens` cleans expired refresh tokens, that don't need to be hold in database store anymore.

```json
{}
```

## SurveyAuthUrlsExport

`SurveyAuthUrlsExport` exports survey respondent authentication details (usernames and authentication URLs).

```json
{
  "surveyId": string
}
```

## SurveyDataExport

`SurveyDataExport` exports survey submission data to CSV file based on scheme-defined export columns.

```json
{
  "id"?: string | string[],
  "surveyId": string,
  "startDate"?: string,
  "endDate"?: string,
  "userId"?: string
}
```

## SurveyFeedbackNotification

`SurveyFeedbackNotification` sends email with attached survey feedback PDF file to provided email address.

```json
{
  "surveyId": string,
  "userId": string,
  "submissions"?: string[],
  "to": string,
  "cc"?: string,
  "bcc"?: string
}
```

## SurveyHelpRequestNotification

`SurveyHelpRequestNotification` sends request help email to study support users.

```json
{
  "surveySlug": string,
  "userId": string,
  "name": string,
  "email": string,
  "phone": string,
  "phoneCountry": string,
  "message": string
}
```

## SurveyNutrientsRecalculation

`SurveyNutrientsRecalculation` recalculates survey submission nutrients. This is useful when nutrient table data changes and need to recalculate all survey submissions.

```json
{
  "surveyId": string
}
```

## SurveyRespondentsImport

`SurveyRespondentsImport` imports survey respondent records from provided CSV file.

```json
{
  "surveyId": string,
  "file": File
}
```

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

## SurveySubmission

`SurveySubmission` processes submission state and saves data.

```json
{
  "surveyId": string,
  "userId": string,
  "state": SurveyState
}
```

## SurveySubmissionNotification

`SurveySubmissionNotification` is used with webhook to dispatch survey submission notification.

```json
{
  "surveyId": string,
  "submissionId": string
}
```

When valid `Submission notification URL` is set in survey settings, webhook is automatically called with each successful submission. Submission data are attached in request body.

If [survey external communication](/admin/surveys/#external-communication) specifies JWT secret, signed JWT token is attached as Bearer in `Authorization` header of the request.

Request

```json
POST https://my-submission-notification-url.example.com

Authorization: Bearer {token}
Content-Type: application/json

{
    ...
}
```

## UserPasswordResetNotification

`UserPasswordResetNotification` is triggered when user requests password reset.

```json
{
  "email": string,
  "userAgent"?: string
}
```

## UserEmailVerificationNotification

`UserEmailVerificationNotification` is triggered when new user signs up.

```json
{
  "email": string,
  "userAgent"?: string
}
```
