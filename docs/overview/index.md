# Overview

Intake24 dietary recall system

It is comprised of following parts:

- Survey/Recall interface
- Admin interface
- API Service
- Databases containing: system data and food data
- CLI

## Survey/Recall interface

Users can access the survey interface to complete their dietary recall. This is generated dependent on the configuration of the survey, done in the admin interface.

A demo survey is available, where users can be dynamically generated. Most users will access the survey using a user account or via a link.

## Admin interface

Allows for administration of surveys, including user accounts. Surveys are based on schemes, which dictate the question structure and other aspects of the survey. A scheme also uses a specific food list, and is thus used for localisation.

## API service

Serves data from the database for the front end interfaces (admin and survey).

## Database

Built on PostgreSQL, there are two databases: `system` and `foods`, storing the system data (users, recalls, surveys, schemes) and food lists respectively.

## CLI

Command line tool with various useful commands / scripts.
