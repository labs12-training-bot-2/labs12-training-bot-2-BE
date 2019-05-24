# Data

## Table of Contents

- [Intro](#data-intro)
- [Overview](#model-overview)
  - [Diagram](#model-diagram)
  - [Resources](#model-resources)
- [Database Standards](#database-standards)
  - [Methods](#database-methods)
  - [Key Names](#database-key-names)
- [Local Database](#local-database)

## Intro

This document will describe the data model built out for the back end, including links to an interactive diagram, describe the standard model methods and key names used to access and manipulate data within the database as well, and information for setting up a local database with PostgreSQL.

## Overview

The data model was refactored into this current shape based on the needs of the app--note that there are no many-to-many relationships. Previously, the back end had been duplicating data in Notifications from other tables such as Messages and Team Members that already existed in those tables. With this current model there is no duplication of data properties, and since the existence of a Notification linking a specific Message (and therefore Training Series) and Team Member together was the only confirmation needed that a Team Member was "assigned" to that Training Series, the many-to-many table connecting the two was eliminated. All needed database info is therefore accessible by simply joining as many tables together as needed, and then selecting the desired information from wherever it may exist. This structure is simpler to work with on the back end with minimal filtering on the front end thanks to Redux, and is much more scalable if more data fields would be required.

### Diagram

[Link](https://dbdiagram.io/d/5cbdd308f7c5bb70c72fb643) to interactive diagram of current database model.

Special note about [dbdiagram.io]: you can generate a FK>>>PK relationship by simply dragging and dropping from the desired Foreign Key to the desired Primary Key.

![Diagram of database model](img/db-diagram.png)

### Resources

Note that all Tables are all snake_case and plural so as to allow for hassle-free manipulation within the database and with query syntax, and reduction of engineer typos. All tables also have auto-generated id integer as Primary Key.

#### account_types

| property               | type    | description                                                                                        | required |
|------------------------|---------|----------------------------------------------------------------------------------------------------|----------|
| title                  | string  | Title of account type: currently only Free, Premium, and Pro based on user interaction with Stripe | yes      |
| max_notification_count | integer | Number of notifications a user is permitted per month based on type. Free:50, Premium:200, Pro:100 | yes      |



#### users

| property           | type         | description                                                                       | required |
|--------------------|--------------|-----------------------------------------------------------------------------------|----------|
| name               | string       | full user name                                                                    | yes      |
| email              | string       | user email, used for authentication                                               | yes      |
| stripe             | string       | Authenticated Stripe ID, if user has one                                          | no       |
| notifications_sent | integer      | Tracks how many notifications have been sent on user's behalf, resets every month | yes      |
| account_type_id    | integer (FK) | points to account_types.id                                                        | yes      |


#### services

| property | type   | description                                                                                             | required |
|----------|--------|---------------------------------------------------------------------------------------------------------|----------|
| name     | string | name of services available for messaging Team Members, currently limited to twilio, sendgrid, and slack | yes      |


#### tokens

| property      | type         | description                                                               | required |
|---------------|--------------|---------------------------------------------------------------------------|----------|
| expiration    | datetime     | when stored token will no longer be valid                                 | no       |
| auth_token    | string       | token given for oAuth authentication                                      | yes      |
| refresh_token | string       | provided by oAuth services if needed for obtaining a renewed access token | no       |
| service_id    | integer (FK) | points to services.id                                                     | yes      |
| user_id       | integer (FK) | points to users.id                                                        | yes      |


#### team_members

| property        | type         | description                                                                                                                    | required |
|-----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------|----------|
| first_name      | string       | team member's first name                                                                                                       | yes      |
| last_name       | string       | team member's last name                                                                                                        | yes      |
| job_description | string       | team member's job description                                                                                                  | no       |
| email           | string       | team member's email, used for sending sendgrid messages if present                                                             | no       |
| phone_number    | string       | team member's phone number, used for sending twilio messages and is required so a team member has at least one form of contact | yes      |
| slack_uuid      | string       | unique identifier for team member's slack account, used to send slack messages if integrated and present                       | no       |
| manager_id      | integer (FK) | points to other entry in team_members table, denotes manager relationship with team member                                     | no       |
| mentor_id       | integer (FK) | points to other entry in team_members table, denotes mentor relationship team member                                           | no       |


#### training_series

| property | type         | description              | required |
|----------|--------------|--------------------------|----------|
| title    | string       | title of training series | yes      |
| user_id  | integer (FK) | points to users.id       | yes      |


#### messages

| property           | type         | description                                                                                                                                                   | required |
|--------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| subject            | string       | subject of message to be sent to team members assigned to training series                                                                                     | yes      |
| body               | string       | message content                                                                                                                                               | yes      |
| link               | string       | url string that links message recipient to training content (not created by app)                                                                              | no       |
| training_series_id | integer (FK) | points to Training Series the message was created for                                                                                                         | yes      |
| for_manager        | boolean      | denotes whether message will send notification to an assigned Team Member's manager, defaults to false                                                        | no       |
| for_mentor         | boolean      | denotes whether message will send notification to an assigned Team Member's mentor, defaults to false                                                         | no       |
| for_manager        | boolean      | denotes whether message will send notification to an assigned Team Member's manager, defaults to false                                                        | no       |
| for_team_member    | boolean      | denotes whether message will send notification to an assigned Team Member, defaults to false. if not set to true, assume it must be sent to manager or mentor | no       |
| days_from_start    | int          | how many days from the start of a Team Member being assigned to the Training Series before the Message will be sent                                           | yes      |


#### notifications

| property       | type        | description                                                                                                                                              | required |
|----------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| send_date      | datetime    | calculated datetime for when notification will be sent based on when recipient is set to start the Training Series based on messages.days_from_start     | yes      |
| is_sent        | boolean     | denotes whether Notification has been successfully sent, defaults to false                                                                               | yes      |
| num_attempts   | integer     | how many times Notification has attempted to be sent--current max allowed is 6                                                                           | yes      |
| thread         | string      | unique thread relating to message history between recipient Team Member and Slack                                                                        | no       |
| message_id     | integer(FK) | points to message.id of Message this Notification was generated from                                                                                     | yes      |
| service_id     | integer(FK) | points to services.id to denote whether messaging medium is twilio, sendgrid, or slack (currently no others)                                             | yes      |
| team_member_id | integer(FK) | points to team_members.id of Team Member whose assignment to the Training Series caused the Notification to be generated (not necessarily the recipient) | yes      |
| recipient_id   | integer(FK) | points to team_members.id of Team Member the Notification is going to--may be assigned Team Member's manager or mentor                                   | yes      |


#### responses

| property        | type        | description                                                                                   | required |
|-----------------|-------------|-----------------------------------------------------------------------------------------------|----------|
| body            | string      | contents of response from Team Member to a successfully sent Notification, needs to be parsed | no       |
| notification_id | integer(FK) | points to notifications.id of Notification the Response is responding to                      | yes      |
| created_at      | timestamp   | timestamp of when Response was created, used to filter based on most recent                   | yes      |


## Database Standards

### Methods

### Key Names

## Local Database
