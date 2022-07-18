# Feedback

Feedback-specific API endpoints accessible to authentication user.

## Feedback data

Get feedback related reference data

### Request

```json
GET /api/feedback

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "nutrientTypes": [
    {
      "id": string,
      "description": string,
      "unit": string,
      "kcalPerUnit": number | null
    },
    ...
  ],
  "physicalActivityLevels": [
    {
      "id": string,
      "name": string,
      "coefficient": number
    },
    ...
  ],
  "weightTargets": [
    {
      "id": string,
      "name": string,
      "coefficient": number
    },
    ...
  ]
}
```
