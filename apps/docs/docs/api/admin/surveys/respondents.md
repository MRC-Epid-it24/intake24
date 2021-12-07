# Survey respondents

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
