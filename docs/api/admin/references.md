# References

## As served sets

Paginated `as served set` reference list

### Request

```http
GET /api/admin/references/as-served-sets
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

## Categories

Paginated `category` reference list

### Request

```http
GET /api/admin/references/categories
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

## Drinkware sets

Paginated `dinkware set` reference list

### Request

```http
GET /api/admin/references/drinkware-sets
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

## Feedback schemes

Paginated `feedback scheme` reference list

### Request

```http
GET /api/admin/references/feedback-schemes
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

## Foods

Paginated `food` reference list

### Request

```http
GET /api/admin/references/foods
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

## Guide images

Paginated `guide image` reference list

### Request

```http
GET /api/admin/references/guide-images
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

## Image maps

Paginated `image map` reference list

### Request

```http
GET /api/admin/references/image-maps
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

## Languages

Paginated `language` reference list

### Request

```http
GET /api/admin/references/languages
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

## Locales

Paginated `locale` reference list

### Request

```http
GET /api/admin/references/locales
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

## Nutrient tables

Paginated `nutrient table` reference list

### Request

```http
GET /api/admin/references/nutrient-tables
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

## Nutrient table records

Paginated `nutrient table record` reference list

### Request

```http
GET /api/admin/references/nutrient-tables/:nutrientTableId/records
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

## Nutrient types

Paginated `nutrient types` reference list.

**Filters** - `nutrientTableId` - optional nutrient table id

### Request

```http
GET /api/admin/references/nutrient-types?nutrientTableId={nutrientTableId}
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

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Survey schemes

Paginated `survey scheme` reference list

### Request

```http
GET /api/admin/references/survey-schemes
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
