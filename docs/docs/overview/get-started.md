# Getting Started

## Dev instance
Steps to getting a local instance running
* Run Dev VM (download from S3 bucket - contact the Intake24 team), which maps out the database on 192.168.56.10:5432 (PostgreSQL). Start this VM.
* Clone the master repository from Github [link](https://github.com/MRC-Epid-it24/intake24)
* Follow instructions to README to install node modules (e.g. `npm install` on each folder) 
* Local servers need to be run for `api-server`, `admin-client` and `survey-client` from each respective folder:
  * To start `api-server`: `npm run dev`
  * To start `admin-client` and `survey-client`: `npm run serve` for live reloads

::: tip
Authentication uses cookies, so separate browser sessions will be required to use both `admin-client` and `survey-client` interfaces at the same time.
:::

## Useful tools
* IDE for developing Node, Typescript, npm and associated tooling (e.g. VS Code)
* Virtual Box (v6.x minimum) for running database VM
* Database browser (e.g. DBeaver) for exploring/manipulating PostgreSQL DB.