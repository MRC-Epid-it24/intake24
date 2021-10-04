# Application

Path: `src/config/app.ts`

## Node environment

Node environment to start the application in.

* object-path: `env`
* dotenv var: `NODE_ENV`
* type: `'development' | 'test' | 'production'`
* default: `'development'`

## Name

Application name.

* object-path: `env`
* dotenv var: `APP_NAME`
* type: `string`
* default: `'Intake24'`

## Host

Internal hostname application listens on.

* object-path: `host`
* dotenv var: `APP_HOST`
* type: `string`
* default: `'localhost'`

## Port

Internal port application listens on.

* object-path: `port`
* dotenv var: `APP_PORT`
* type: `number`
* default: `3100`

## Sites URLs

List of sites URLs. These can either be relative or absolute URLs.

* absolute URL -> site is hosted on different domain
* relative URL -> site is hosted on same domain. URL gets registered as route.

### Base URL / Domain

Domain / base url to resolve fully qualified sites URLs (if relative)

* object-path: `url.base`
* dotenv var: `APP_URL_BASE`
* type: `string`
* default: `'localhost:3100'`

### Admin URL

URL of admin site.

* object-path: `url.admin`
* dotenv var: `APP_URL_ADMIN`
* type: `string`
* default: `'/admin'`

### Documentation URL

URL of documentation site.

* object-path: `url.docs`
* dotenv var: `APP_URL_DOCS`
* type: `string`
* default: `'/docs'`

### Survey URL

URL of survey site.

* object-path: `url.survey`
* dotenv var: `APP_URL_SURVEY`
* type: `string`
* default: `'/survey'`
  
### Images URL

URL of images.

* object-path: `url.images`
* dotenv var: `APP_URL_IMAGES`
* type: `string`
* default: `'localhost:3100/images'`

::: tip
Default setup allows local images serving - ideal for development purposes. For production, use reverse proxy, CDN etc.
:::
