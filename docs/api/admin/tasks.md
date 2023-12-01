# Tasks

## Browse tasks

Browse paginated task list

### Request

```json
GET /api/admin/tasks
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

## Create task

Create new task entry

### Request

```json
POST /api/admin/tasks

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "job": string,
    "cron": '0 * * * *',
    "active": boolean,
    "description": string | null
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get task

Get task entry

### Request

```json
GET /api/admin/tasks/:taskId

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

## Update task

Update task entry

### Request

```json
PUT /api/admin/tasks/:taskId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "job": string,
    "cron": '0 * * * *',
    "active": boolean,
    "description": string | null
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete task

Delete task entry

### Request

```json
DELETE /api/admin/tasks/:taskId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Run task

Trigger task pushing into the job queue

### Request

```json
POST /api/admin/tasks/:taskId/run

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
