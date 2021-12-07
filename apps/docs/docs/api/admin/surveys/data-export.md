# Survey data export

## Queue data export

Submits a job to generate CSV file with submission data.

### Request

```http
POST /api/admin/surveys/:surveyId/data-export

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

Returns job resource entry.

```json
200 OK

{
    "data": {...},
}
```

## Download data export

Download CSV file with submission data.

### Request

```http
POST /api/admin/surveys/:surveyId/data-export/sync

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

Returns `Buffer`.

```
200 OK
```
