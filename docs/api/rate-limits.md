# Rate and usage limits

API is rate limited to allow fair usage. API responses will include headers that conform the [`draft-07` specification](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers-07).

| Header           | Description                                          |
| ---------------- | ---------------------------------------------------- |
| RateLimit        | Header containing limit, remaining, and reset values |
| RateLimit-Policy | Informative rate policy                              |
| Retry-After      | Attached on blocked requests                         |

Blocked requests will return an HTTP `429 Too Many Requests` status code.

```json
429 Too Many Requests
```

### Two types of limits are applied:

- global more relaxed rate limits on all endpoint
- more strict rate limits sensitive endpoints
