# Foods and Index Builder

## For Rebuilding a Specific Locale

Rebuilding Index for a Specific Locale

### Request

```json
POST /api/admin/foods/global/rebuild
{
    locale: "LOCALE_ID"
}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "sucess": boolean
}
```

## For Rebuilding All Enabled Locales

Rebuilding all Indexes of the all Locales

### Request

```json
POST /api/admin/foods/global/rebuild
{}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "sucess": boolean
}
```
