# Users

Users resource defines primary user records.

## Detail tab

Detail tab displays selected user info.

## Create / Edit tab

Edit tab allows to modify selected user.

- `Name` - User name

- `Email` - Valid email address, allows login to admin tool and restore password functionality

- `Phone` - Phone number

- `Assigned roles` - Roles user is assigned with. Grants permissions based on the role settings.

- `Assigned permissions` - Permissions user is **directly** assigned with (not through the `role`).

::: tip Survey-based permissions
When setting up survey-related users, it's better to handle permissions through Survey UI. For setting up system users, it's better to use roles as there are usually more people that will require similar set of permissions and it's then easier to manage through role rather than individually through each user/permission.
:::

- `Multi-factor authentication` - Turns `on` / `off` multi-factor authentication for specific user. This firstly needs to be enabled on system level and correctly configured with 3rd party provider.

- `Email notifications` - to be clarified

- `SMS notifications` - to be clarified

