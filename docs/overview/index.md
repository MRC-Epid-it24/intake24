# Overview

Intake24 dietary recall system

It is consists of following parts:

- [Survey/Recall interface](/survey/)
- [Admin tool](/admin/)
- [API Service](/api/)
- [CLI](/cli/)
- Databases (system DB and food DB)

## Survey/Recall interface

Users can access the survey interface to complete their dietary recall. This is generated dependent on the configuration of the survey, which is configured through the the admin tool.

A demo survey is available, where users can be dynamically generated. Most users will access the survey using a user account (username:password combination) or via an unique authentication link.

## Admin tool

Allows for administration of surveys, including user accounts. Surveys are based on schemes, which dictate the question structure and other aspects of the survey. A scheme also uses a specific food list, and is thus used for localisation.

## API service

Serves data from the database for the front end interfaces (admin and survey).

## CLI

Command line tool with various useful commands / scripts.

## Database

Built on PostgreSQL, there are two databases: `system` and `foods`, storing the system data (users, recalls, surveys, schemes) and food lists respectively.
