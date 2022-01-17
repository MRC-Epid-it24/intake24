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

## Survey references

Get survey references

### Request

```http
GET /api/admin/surveys/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "languages": [
        {
            "id": string,
            "englishName": string,
            "localName": string,
            "countryFlagCode": string
        },
        ...
    ],
    "locales": [
        {
            "id": string,
            "englishName": string,
            "localName": string
        },
        ...
    ],
    "schemes": [{...}]
}
```
