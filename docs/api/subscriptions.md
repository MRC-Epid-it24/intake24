# Web Push notifications

Web Push notifications subscriptions management

## Subscribe

Subscribe logged-in user to receive web-push notifications. It expects the subscription object produced by `PushManager.subscribe()` [Web API](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe)

### Request

```http
POST /api/subscriptions

Content-Type: application/json

{
    "subscription": {
        "endpoint": string,
        "keys": {
            "p256dh": string,
            "auth": string
        }
    }
}
```

### Response

```json
200 OK
```

## Unsubscribe

Unsubscribe logged-in user from receiving web-push notifications

### Request

```http
DELETE /api/subscriptions

Content-Type: application/json
```

### Response

```json
204 No Content
```

## Push

Send `test` Push notification to logged-in user

### Request

```http
POST /api/subscriptions/push

Content-Type: application/json
```

### Response

```json
200 OK
```
