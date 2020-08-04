# Overview

Intake24 [description]

It is comprised of four key parts:

* Survey/Recall interface
* Admin interface
* API Service
* Database containing: system data, and food data

## Survey/Recall interface

Users can access the survey interface to complete their dietary recall. This is generated dependent on the configuration of the survey, done in the admin interface.

A demo survey is available, where users can be dynamically generated. Most users will access the survey using a user account or via a link.

## Admin interface

Allows for administration of surveys, including user accounts. Surveys are based on schemes, which dictate the question structure and other aspects of the survey. A scheme also uses a specific food list, and is thus used for localisation.

## API service

Serves data from the database for the front end interfaces (admin and survey).

## Database

Built on PostgreSQL, there are two databases: `intake24_system` and `intake24_foods`, storing the system data (users, recalls, surveys, schemes) and food lists respectively.
