# Securables

Following resources / record types implement `securable` per-record access.

- `Feedback scheme`
- `Survey scheme`
- `Surveys`

Securable permissions can be granted / revoked for any specific record in `Security` tab of the record.

`Security` tab allows to control:

<!-- prettier-ignore -->
  - [Securable permissions](#securable-permissions)
  - [Record ownership](#record-ownership)

## Securable permissions

| Permission | Description                     |
| ---------- | ------------------------------- |
| browse     | Browse / list record            |
| read       | Read record details             |
| edit       | Edit record                     |
| delete     | Delete record                   |
| securables | Control `securable` permissions |
| [action]   | Specific record action          |

## Record ownership

`Security` also allows to manage ownership of the record. Ownership can be added / modified / removed.

:::tip
If user `creates new record` or `copies existing record`, user automatically becomes the owner of the record.

Owner of the record has full access to the record, without the need to grant additional permissions from above table.
:::
