# Feedback

Feedback-specific API endpoints accessible to authentication user.

## Henry coefficients

Henry coefficients for feedback calculations.

### Request

```http
GET /api/feedback/henry-coefficients

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
  {
    "sex": Sex,
    "ageRange": [number, number],
    "weightCoefficient": number,
    "heightCoefficient": number,
    "constant": number
  }
]
```

## Physical activity levels

Physical activity levels for feedback calculations.

### Request

```http
GET /api/feedback/physical-activity-levels

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
    "coefficient": number
  },
  ...
]
```

## Weight targets

Weight targets for feedback calculations.

### Request

```http
GET /api/feedback/weight-targets

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
    "coefficient": number
  },
  ...
]
```
