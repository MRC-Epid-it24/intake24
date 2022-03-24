# Access control list (ACL)

Path: `apps/api/src/config/acl.ts`

## Cache

Controls the permissions / roles caching

### Enabled

Enables / disables caching for permissions / roles.

- object-path: `cache.enabled`
- dotenv var: `ACL_CACHE_ENABLED`
- type: `boolean`
- default: `false`

### Expires in

Sets time the cache data expires at. Defined as `ms-formatted` string (see [ms](https://github.com/vercel/ms) for more information) or number in seconds.

- object-path: `cache.expiresIn`
- dotenv var: `ACL_CACHE_EXPIRES_IN`
- type: `number | string`
- default: `'7d'`

## Roles

List of special-purpose roles.

- object-path: `roles`

### Superuser

Any newly created permission will be associated with this role.

- object-path: `roles.superuser`
- type: `string`
- default: `'superuser'`
