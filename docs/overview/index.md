# Overview

Intake24 dietary recall system

Backend components of Intake24 dietary recall system are:

- [API Service](/api/) - serves data from the database for the front end interfaces (admin and survey) and 3rd party applications

- [CLI](/cli/) - command line tool with various useful commands / scripts

- Persistent layer - two separate databases:

  - `Food DB` - stores food data
  - `System DB`- stores system data (users, recalls, surveys, schemes)

Frontend components of Intake24 dietary recall system are two applications:

- [Survey/Recall interface](/survey/) - the main interface for users to complete their dietary recall

- [Admin tool](/admin/) - Admin tool for system configuration and management
