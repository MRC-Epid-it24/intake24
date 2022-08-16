# Food databases

## Browse food databases

Browse paginated food database list (effectively locale list)

### Request

```json
GET /api/admin/fdbs
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

## Get food database

Get food database entry

### Request

```json
GET /api/admin/fdbs/:localeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{

}
```

## Browse categories

Browse paginated category list

### Request

```json
GET /api/admin/fdbs/:localeId/categories
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

## Browse foods

Browse paginated food list

### Request

```json
GET /api/admin/fdbs/:localeId/foods
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
