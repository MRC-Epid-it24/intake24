# Tasks

Tasks resource allows to schedule repeatable jobs or run one-off jobs.

## Detail tab

Detail tab displays selected task info.

## Create / Edit tab

Edit tab allows to modify selected task.

- `Name` - Unique string within `tasks` records

- `Job` - Valid job from provided list

- `CRON` - Valid `cron` entry to be used for scheduling

- `Active` - Scheduler `on` / `off` status

- `Description` - Free text, any details about the particular task

- `Task parameters` - Additional job specific parameters

## Manual task trigger

Task can be triggered as one-off job using `trigger job` button on `detail` / `edit` tabs.

## Available jobs

#### CleanRedisStore

`CleanRedisStore` wipes the specific redis stores. e.g. `cache` or `session`

#### CleanStorageFiles

`CleanStorageFiles` wipes temporary storage files, e.g. `downloads` and `uploads` folders.

#### PurgeRefreshTokens

`PurgeRefreshTokens` clean expired refresh tokens, that don't need to be hold in database store anymore.

#### SendPasswordReset

`SendPasswordReset` is triggered when user requests password reset.

#### SyncLanguageTranslations

`SyncLanguageTranslations` synchronizes database language translation records with built-in English translation. 

:::tip Built-in translations update
This needs to be run if object structure changes, so all database records are synced to use same structure.
:::

#### NutrientTableImportData

`NutrientTableImportData` imports data from CSV file containing nutrient data.

#### NutrientTableImportMapping

`NutrientTableImportMapping` imports Excel-based nutrient mappings from CSV file.

#### SurveyDataExport

`SurveyDataExport` survey submission data to CSV file based on scheme-defined export columns.

#### SurveyExportRespondentAuthUrls

`SurveyExportRespondentAuthUrls` survey respondent authentication details (usernames and authentication URLs).

#### SurveyImportRespondents

`SurveyImportRespondents` imports survey respondent records from provided CSV file.

**Available columns**

| Column       | Description  | Record           |
| ------------ | ------------ | ---------------- |
| userName     | Required     | UserSurveyAlias  |
| password     | Required     | UserSurveyAlias  |
| name         | Optional     | User             |
| email        | Optional     | User             |
| phone        | Optional     | User             |
| *            | Optional     | UserCustomField  |

:::tip User custom fields
Any additional column not listed above, will get stored as `UserCustomField` record, which is `key` -> `value` record in database table.
:::

#### SurveySubmissionNotification

`SurveySubmissionNotification` used by webhook to call survey submission notification. Calls the `submission URL` defined in survey settings. It call `POST` request and attached whole submission 

- reuqest 
