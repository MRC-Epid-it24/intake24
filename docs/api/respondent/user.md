# User

User API endpoints accessible to authentication user.

## Feedback download

Download feedback as PDF. Returns stream as `application/pdf`.

### Request

```http
GET /api/user/feedback?survey={survey-slug}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK
```

## Get physical data

Get user's physical data.

### Request

```http
GET /api/user/physical-data

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "userId": string,
  "sex": Sex | null,
  "weightKg": number | null,
  "heightCm": number | null,
  "physicalActivityLevelId": number | null,
  "birthdate": number | null,
  "weightTarget": WeightTarget | null,
}
```

## Update physical data

Update user's physical data.

### Request

```http
POST /api/user/physical-data?survey={survey-slug}

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sex": Sex | null,
  "weightKg": number | null,
  "heightCm": number | null,
  "physicalActivityLevelId": number | null,
  "birthdate": number | null,
  "weightTarget": WeightTarget | null,
}
```

### Response

```json
200 OK

{
  "userId": string,
  "sex": Sex | null,
  "weightKg": number | null,
  "heightCm": number | null,
  "physicalActivityLevelId": number | null,
  "birthdate": number | null,
  "weightTarget": WeightTarget | null,
}
```

## Submissions

User submissions for specific survey

### Request

```http
GET /api/user/submissions?survey={survey-slug}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
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
        "name": string,
        "email": string,
        "phone": string,
        "aliases": [
          {
            "userId": string,
            "surveyId": string,
            "username": string,
            "urlAuthToken": string
          },
          ...
        ],
        "customFields": [
          {
            "id": string,
            "userId": string,
            "name": string,
            "value": string
          },
          ...
        ]
      }
    ],
    "customFields": [
      {
        "id": string,
        "submissionId": string,
        "name": string,
        "value": string
      },
      ...
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
          },
          ...
        ],
        "foods": [{...}],
        "missingFoods": [{...}]
      }
    ]
  }
]
```

## Update password

Update password of authenticated user

### Request

```http
POST /api/user/password

Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "passwordCurrent": string,
  "password": string,
  "passwordConfirm": string
}
```

### Response

```json
200 OK
```
