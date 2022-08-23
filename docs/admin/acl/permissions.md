# Permissions

Permissions resource defines system-level implemented access control.

::: warning
Usually, there is no need to create / edit / delete permissions as they are distributed as database migrations to ensure system functionality.
:::

## Detail

Detail tab displays selected permission info.

## Create / Edit

Edit tab allows to modify selected permission.

- `Name` - Unique `slug-based` permission name within `permission` records

- `Display name` - User friendly permission name

- `Description` - Free text, any permission specific details

## Deletion

`System-level` defined permission can prevent normal functionality, loosing access to various parts of the system. So should be treated as such. Deletion will also wipe `role` and `user` related pivot table records.
