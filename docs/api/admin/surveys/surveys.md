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
    "id": string | null,
    "name": string | null,
    "state": SurveyState,
    "localeId": string | null,
    "schemeId": string | null,
    "startDate": string | null,
    "endDate": string | null,
    "supportEmail": string | null,
    "suspensionReason": string | null,
    "allowGenUsers": boolean,
    "genUserKey": string | null,
    "authUrlDomainOverride": string | null,
    "authUrlTokenCharset": string | null,
    "authUrlTokenLength": number | null,
    "storeUserSessionOnServer": boolean,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string | null,
    "numberOfSubmissionsForFeedback": number,
    "maximumDailySubmissions": number,
    "maximumTotalSubmissions": number | null,
    "minimumSubmissionInterval": number,
    "searchSortingAlgorithm": SearchSortingAlgorithm,
    "searchMatchScoreWeight": number,
    "overrides": SchemeOverrides,
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get survey

Get survey entry

### Request

```http
GET /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    ...
}
```

## Update survey

Update survey entry

### Request

```http
PUT /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string | null,
    "state": SurveyState,
    "localeId": string | null,
    "schemeId": string | null,
    "startDate": string | null,
    "endDate": string | null,
    "supportEmail": string | null,
    "suspensionReason": string | null,
    "allowGenUsers": boolean,
    "genUserKey": string | null,
    "authUrlDomainOverride": string | null,
    "authUrlTokenCharset": string | null,
    "authUrlTokenLength": number | null,
    "storeUserSessionOnServer": boolean,
    "feedbackEnabled": boolean,
    "feedbackStyle": string,
    "submissionNotificationUrl": string | null,
    "numberOfSubmissionsForFeedback": number,
    "maximumDailySubmissions": number,
    "maximumTotalSubmissions": number | null,
    "minimumSubmissionInterval": number,
    "searchSortingAlgorithm": SearchSortingAlgorithm,
    "searchMatchScoreWeight": number,
    "overrides": SchemeOverrides,
}
```

### Response

```json
200 OK

{
    ...
}
```

## Partial update survey

Update survey entry - patch / partial update

### Request

```http
PATCH /api/admin/surveys/:surveyId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name"?: string | null,
    "state"?: SurveyState,
    "localeId"?: string | null,
    "schemeId"?: string | null,
    "startDate"?: string | null,
    "endDate"?: string | null,
    "supportEmail"?: string | null,
    "suspensionReason"?: string | null,
    "allowGenUsers"?: boolean,
    "genUserKey"?: string | null,
    "authUrlDomainOverride"?: string | null,
    "authUrlTokenCharset"?: string | null,
    "authUrlTokenLength"?: number | null,
    "storeUserSessionOnServer"?: boolean,
    "feedbackEnabled"?: boolean,
    "feedbackStyle"?: string,
    "submissionNotificationUrl"?: string | null,
    "numberOfSubmissionsForFeedback"?: number,
    "maximumDailySubmissions"?: number,
    "maximumTotalSubmissions"?: number | null,
    "minimumSubmissionInterval"?: number,
    "searchSortingAlgorithm"?: SearchSortingAlgorithm,
    "searchMatchScoreWeight"?: number,
    "overrides"?: SchemeOverrides,
}
```

### Response

```json
200 OK

{
    ...
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

## Queue task

Submits job to the queue.

Specific jobs can be submitted to the queue. Each job type has its own parameters. See [job types](/admin/system/job-types) for more information.

### Request

```http
POST /api/admin/surveys/:surveyId/tasks

Authorization: Bearer {accessToken}
Content-Type: application/json | multipart/form-data

{
    "type": string,
    "params": {
        ...
    }
}
```

### Response

Returns job resource entry.

```json
200 OK

{
    ...
}
```
