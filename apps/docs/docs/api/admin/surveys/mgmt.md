# Survey management

Survey management works with following permissions.

### Survey resource permissions:

- `surveys-browse` - allows to browse survey list
- `surveys-create` - allows to create survey record
- `surveys-read` - allows to read survey record
- `surveys-edit` - allows to edit the survey list
- `surveys-delete` - allows to browse the survey list
- `surveys-overrides` - allows to manage survey scheme overrides
- `surveys-mgmt` - allows to manage staff accounts
- `surveys-respondents` - allows to manage respondents accounts
- `surveys-submissions` - allows to read survey submissions
- `surveys-data-export` - allows to export survey submission data

### Two specific permissions:

- `{surveyId}/staff` - gives access to particular study record
- `{surveyId}/support` - user will receive any help queries from survey respondents

## Browse management users

Get list of survey management users having at least one of the above permission list.

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
    "data": [
        {
            "id": string,
            "name": string,
            "email": string,
            "permissions": [
                {
                    "id": string,
                    "name": string,
                    "displayName": string,
                }
            ]
        }
    ],
    "meta": {...}
}
```

## Available management permissions

Get list of permissions, which can be assigned to survey management users.

### Request

```http
GET /api/admin/surveys/:surveyId/mgmt/permissions

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "name": string,
        "displayName": string
    }
]
```

## Available management users

Get list of users with system active account and no permission from above permission list.

### Request

```http
GET /api/admin/surveys/:surveyId/mgmt/users?search={searchText}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "name": string,
        "email": string
    }
]
```

## Create management user

Assign list of survey management roles to specified user

* `{surveyId}/staff`
* `{surveyId}/support`

### Request

```http
POST /api/admin/surveys/:surveyId/mgmt

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "email": string,
    "name": string | undefined,
    "phone": string | undefined,
    "permissions": string[]
}
```

### Response

```json
201 Created
```

## Update management user

Assign list of survey management permissions to specified user

### Request

```http
PATCH /api/admin/surveys/:surveyId/mgmt/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "permissions": string[]
}
```

### Response

```json
200 OK
```
