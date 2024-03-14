# Survey submissions

## Browse survey submissions

Get list of survey submissions.

### Request

```http
GET /api/admin/surveys/:surveyId/submissions
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

## Get survey submission

Get survey submission entry

### Request

```http
GET /api/admin/surveys/:surveyId/submissions/:submissionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "id": string,
  "surveyId": string,
  "userId": string,
  "startTime": Date,
  "endTime": Date,
  "submissionTime": Date,
  "log": string | null,
  "uxSessionId": string,
  "user": [
    {
      "id": string,
      "name": string | null,
      "email": string | null,
      "phone": string | null,
      "aliases": [
        {
          "userId": string,
          "surveyId": string,
          "username": string,
          "urlAuthToken": string
        }
      ],
      "customFields": [
        {
          "id": string,
          "userId": string,
          "name": string,
          "value": string
        }
      ]
    }
  ],
  "customFields": [
    {
      "id": string,
      "submissionId": string,
      "name": string,
      "value": string
    }
  ],
  "meals": [
    {
      "id": string,
      "submissionId": string,
      "name": string,
      "hours": number,
      "minutes": number,
      "customFields": [
        {
          "id": string,
          "meaId": string,
          "name": string,
          "value": string
        }
      ],
      "foods": [{...}],
      "missingFoods": [{...}]
    }
  ]
}
```

## Delete survey submission

Delete survey submission records

### Request

```http
DELETE /api/admin/surveys/:surveyId/submissions/:submissionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
