# Introduction

Access control list (`ACL`) implementation is based on three models:

* `user`
* `role`
* `permission`

## Database structure

Relations between the models are defined as follows:

* `many-to-many` between `user` and `role`
* `many-to-many` between `user` and `permission`
* `many-to-many` between `role` and `permission`

This allows to grant permissions to users in two ways:

* directly associate `permission` with `user`
* associate `permission` with `user` through `role` (acting as grouping record for a set of permissions)

Permissions need to be implemented on system-level and are usually distributed as database migration. Under normal circumstances, user won't need to create / modify / delete permission list.

## Resource permissions

Permissions are resource-based and use `slug` naming convention. It is formed from resource name and action. Base actions are `browse`, `read`, `create`, `edit`, `delete`. Other resource-specific actions follows similar convention.

| Permission        | Description                                            |
| ----------------- | ------------------------------------------------------ |
| resource-browse   | Allows to browse / list resource records               |
| resource-read     | Allows to read details about the resource record       |
| resource-create   | Allows to create new resource record                   |
| resource-edit     | Allows to modify existing resource record              |
| resource-delete   | Allows to delete existing resource record              |
| resource-action   | Allows to perform specific action for resource record  |


## Special purpose permissions

Current Intake24 ACL system also implements couple of V3-based specific permissions.

- `surveyadmin` - grants access to all survey records

- `${surveyId}/respondent` - grants user respondent access to specific survey based on the `surveyId`, which is incorporated into permission name. Permission is automatically created when new survey record is created. `Survey Respondent` page allows to assign permission directly selected user. Whenever respondent record is created either using Admin UI or importing CSV file, this permission is attached directly to user.

- `${surveyId}/staff` - grants access to specific survey record based on the `surveyId`, which is incorporated into permission name. Permission is automatically created when new survey record is created. Survey Management page allows to assign permission directly selected user.

- `${surveyId}/support` - nominates user to receive survey's respondents help request based on the `surveyId`, which is incorporated into permission name. Permission is automatically created when new survey record is created. Survey Management page allows to assign permission directly selected user.

- `foodsadmin` - grants access to all food databases / food list records

- `fdbm/${localeId}` - grants access to specific food list record based on the `localeId`, which is incorporated into permission name. Permission is automatically created when new survey record is created.

- `globalsupport` - nominates user to receive respondents help request from all surveys.
