# Drinkware sets

## Browse drinkware sets

Browse paginated drinkware set list

### Request

```http
GET /api/admin/images/drinkware-sets
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
            "description": string,
            "imageUrl": string,
        },
        ...
    ],
    "meta": {...}
}
```

## Create drinkware set

Create new drinkware set entry

### Request

```http
POST /api/admin/images/drinkware-sets

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "description": string,
    "guideImageId": string
}
```

### Response

```json
201 Created

{
    "id": string,
    "description": string,
    "guideImageId": string,
    "imageUrl": string,
    "scales": [
        {
            "id": string,
            "drinkwareSetId": string,
            "width": number,
            "height": number,
            "emptyLevel": number,
            "fullLevel": number,
            "choiceId": number,
            "baseImageUrl": string,
            "overlayImageUrl": string
        },
        ...
    ],
}
```

## Get drinkware set

Get drinkware set entry

### Request

```http
GET /api/admin/images/drinkware-sets/:drinkwareSetId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "id": string,
    "description": string,
    "guideImageId": string,
    "imageUrl": string,
    "scales": [
        {
            "id": string,
            "drinkwareSetId": string,
            "width": number,
            "height": number,
            "emptyLevel": number,
            "fullLevel": number,
            "choiceId": number,
            "baseImageUrl": string,
            "overlayImageUrl": string
        },
        ...
    ],
}
```

## Update drinkware set

Update drinkware set entry

### Request

```http
PUT /api/admin/images/drinkware-sets/:drinkwareSetId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "description": string,
    "guideImageId": string
}
```

### Response

```json
200 OK

{
    "id": string,
    "description": string,
    "guideImageId": string,
    "imageUrl": string,
    "scales": [
        {
            "id": string,
            "drinkwareSetId": string,
            "width": number,
            "height": number,
            "emptyLevel": number,
            "fullLevel": number,
            "choiceId": number,
            "baseImageUrl": string,
            "overlayImageUrl": string
        },
        ...
    ],
}
```

## Delete drinkware set

Delete drinkware set entry

### Request

```http
DELETE /api/admin/images/drinkware-sets/:drinkwareSetId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
