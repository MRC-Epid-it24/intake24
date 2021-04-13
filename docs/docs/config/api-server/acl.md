# Access control list (ACL)

Path: `src/config/acl.ts`

Access control list (`ACL`) implementation is based on three models:

* `user`
* `role`
* `permission`

Relations between the models are defined as follows:

* `many-to-many` between `user` and `role`
* `many-to-many` between `user` and `permission`
* `many-to-many` between `role` and `permission`

This allows to grant permissions to users in two ways:

* directly associate `permission` with `user`
* associate `permission` with `user` through `role` (acting as grouping record for a set of permissions)

Path: `src/config/acl.ts`

## Cache
Controls the permissions / roles caching

### Enabled
Enables / disables caching for permissions / roles.

* object-path: `cache.enabled`
* dotenv var: `ACL_CACHE_ENABLED`
* type: `boolean`
* default: `false`

### Expires in
Sets time the cache data expires at. Defined as `ms-formatted` string (see [ms](https://github.com/vercel/ms) for more information) or number in seconds.

* object-path: `cache.expiresIn`
* dotenv var: `ACL_CACHE_EXPIRES_IN`
* type: `number | string`
* default: `'7d'`

## Roles

List of special-purpose roles.

* object-path: `roles`

### Superuser

Any newly created permission will be associated with this role.

* object-path: `roles.superuser`
* type: `string`
* default: `'superuser'`

## Permissions

List of special-purpose permissions.

* object-path: `permissions`

### Global support

Name of the permission, which defines top-level system support.

* object-path: `permissions.globalsupport`
* type: `string`
* default: `'globalsupport'`

### Survey admin

Name of the permission, which allows to work with any `survey` record.

* object-path: `permissions.surveyadmin`
* type: `string`
* default: `'surveyadmin'`

### Foods admin

Name of the permission, which allows to work with any `food` record.

* object-path: `permissions.foodsadmin`
* type: `string`
* default: `'foodsadmin'`
