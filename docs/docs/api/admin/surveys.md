# Surveys

## Browse surveys

Browse paginated survey list

### Request

```http
GET /api/admin/surveys
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Create survey

Create new survey entry

### Request

```http
POST /api/admin/surveys

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "state": 0 | 1 | 2,
    "startDate": Date,
    "endDate": Date,
    "schemeId": string,
    "locale": string,
    "allowGenUsers": boolean,
    "suspensionReason": string,
    "surveyMonkeyUrl": string,
    "supportEmail": string,
    "originatingUrl": string,
    "description": string,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string,
    "storeUserSessionOnServer": boolean,
    "numberOfSubmissionsForFeedback": number,
    "finalPageHtml": string
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get survey

Get survey entry

### Request url

```http
GET /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Update survey

Update survey entry

### Request url

```http
PUT /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "state": 0 | 1 | 2,
    "startDate": Date,
    "endDate": Date,
    "schemeId": string,
    "locale": string,
    "allowGenUsers": boolean,
    "suspensionReason": string,
    "surveyMonkeyUrl": string,
    "supportEmail": string,
    "originatingUrl": string,
    "description": string,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string,
    "storeUserSessionOnServer": boolean,
    "numberOfSubmissionsForFeedback": number,
    "finalPageHtml": string
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Delete survey

Delete survey entry

### Request

```http
DELETE /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Browse management users

Get list of survey management users.

::: tip List content
List includes users with `{surveyId}/staff` and `{surveyId}/support` roles.
:::

### Request

```http
GET /api/admin/surveys/:surveyId/mgmt
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Browse available management users

Get list of users, which can be assigned as survey management.

::: tip List content
List includes users with `system account` and no `{surveyId}/staff` or `{surveyId}/support` role.
:::

### Request

```http
GET /api/admin/surveys/:surveyId/mgmt/available

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}]
}
```

## Update management user

Assign list of survey management roles to specified user

* `{surveyId}/staff`
* `{surveyId}/support`

### Request

```http
PUT /api/admin/surveys/:surveyId/mgmt/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "roles": string[]
}
```

### Response

```json
200 OK
```

## Browse respondents

Get list of survey respondents.

::: tip List content
List includes users with `{surveyId}/respondent` role.
:::

### Request

```http
GET /api/admin/surveys/:surveyId/respondents
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Create respondent

Create new survey respondent

### Request

```http
POST /api/admin/surveys/:surveyId/respondents

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "userName": string,
    "name": string,
    "email": string,
    "phone": string,
    "password": string,
    "passwordConfirm": string,
    "customFields": {
        "name": string,
        "value": string
    }[]
}
```

### Response

```json
201 Created

{
    "data": {...},
}
```

## Update respondent

Update survey respondent

### Request

```http
PUT /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "userName": string,
    "name": string,
    "email": string,
    "phone": string,
    "password": string,
    "passwordConfirm": string
}
```

### Response

```json
200 OK

{
    "data": {...},
}
```

## Delete respondent

Delete respondent

### Request

```http
DELETE /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
