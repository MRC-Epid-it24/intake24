# Filesystem

Path: `apps/api/src/config/filesystem.ts`

## Public dir

Public directory for serving static files.

- object-path: `local.public`
- dotenv var: `FS_PUBLIC`
- type: `string`
- default: `'public'`

## Upload dir

Upload directory for storing temporarily uploaded files.

- object-path: `local.upload`
- dotenv var: `FS_UPLOAD`
- type: `string`
- default: `'storage/upload'`

## Download dir

Download directory for storing temporarily downloaded files.

- object-path: `local.download`
- dotenv var: `FS_DOWNLOAD`
- type: `string`
- default: `'storage/download'`

## Images dir

Images directory for locally hosted images.

- object-path: `local.images`
- dotenv var: `FS_IMAGES`
- type: `string`
- default: `'storage/images'`

## URL Expiration

Expiration of URLs for generated files. Defined as `ms-formatted`string, see [ms](https://github.com/vercel/ms) for more information.

- object-path: `urlExpiresAt`
- type: `string`
- default: `'2d'`
