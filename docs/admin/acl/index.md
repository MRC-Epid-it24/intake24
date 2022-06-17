# Introduction

Intake24 implements Access control list (`ACL`) in two ways.

1. [Resources](/admin/acl/resources)
2. [Securables](/admin/acl/securables)

## Resources

Resource-based access means that when user has some permission, it gives access to whole resource = all records.

:::tip
User with permission `Edit surveys` can edit **any survey record**.
User with permission `Delete users` can delete **any user record**.
:::

## Securables

Securables allows to grant specific permission to per-record within the resource.
