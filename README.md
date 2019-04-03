# 💬 Training Bot API 💬

## Introduction

Training bot allows managers of teams to send notifications to their teammates on a predefined schedule.

## Table of Contents

-   [💬 Training Bot API 💬](#%F0%9F%92%AC-training-bot-api-%F0%9F%92%AC)
    -   [Introduction](#introduction)
    -   [Table of Contents](#table-of-contents)
-   [Overview](#overview)
    -   [What is Training Bot? 🤖](#what-is-training-bot-%F0%9F%A4%96)
    -   [Mission Statement 📜](#mission-statement-%F0%9F%93%9C)
-   [Usage](#usage)
    -   [Getting Started](#getting-started)
-   [Database Tables](#database-tables)
    -   [Schema](#schema)
    -   [User](#user)
    -   [TrainingSeries](#trainingseries)
    -   [TeamMember](#teammember)
    -   [Post](#post)
    -   [accountType](#accounttype)
    -   [RelationalTable](#relationaltable)
-   [Endpoints](#endpoints)
    -   [All endpoints](#all-endpoints)
-   [🖥 Data requests and responses 🖥](#%F0%9F%96%A5-data-requests-and-responses-%F0%9F%96%A5)
    -   [`/api/auth`](#apiauth)
    -   [`/api/users/:id`](#apiusersid)
    -   [`/api/users/:id/training-series`](#apiusersidtraining-series)
    -   [`/api/users/:id/team-members`](#apiusersidteam-members)
    -   [`/api/training-series`](#apitraining-series)
    -   [`/api/training-series/:id`](#apitraining-seriesid)
    -   [`/api/training-series/:id/posts`](#apitraining-seriesidposts)
    -   [`/api/posts`](#apiposts)
    -   [`/api/posts/:id`](#apipostsid)
    -   [`/api/team-members`](#apiteam-members)
    -   [`/api/team-members/:id`](#apiteam-membersid)
    -   [`/api/team-members/assign`](#apiteam-membersidtraining-series)
    -   [`/api/team-members/assign/:id`](#apiteam-membersidtraining-seriestsid)
    -   [`/api/stripe`](#apistripe)
    -   [`/api/stripe/unsubscribe`](#apistripeunsubscribe)

# Overview

## What is Training Bot? 🤖

Training Bot is a learning application that lets a team leader create a series of trainings and deliver them at a scheduled time via text or email to assigned learners. The user will be able to add members and assign them to a scheduled set of trainings with a start date. Each training will have a title, text body, and link. They should be small snippets that fit well in a text message sized post.

## Mission Statement 📜

Training Bot empowers team leaders with tools to assist with their team’s continual learning.

# Usage

## Getting Started

**The Package Manager used for this project is `yarn`**

1. Clone the repository and change into the directory.
2. Install dependencies

```
yarn install
```

3. Start the server

```
yarn server
```

4. Test server is functioning on postman
    - In postman make a get request to: `localhost:4000/`
    - You should receive a message stating: 'It works'!

# Database Tables

## Schema

![Schema Table](https://i.imgur.com/oPQ8FuF.png)

## User

| Name          | Type    | Details                             |
| ------------- | ------- | ----------------------------------- |
| userID        | int     | PK                                  |
| accountTypeID | int     | FK - refs accountType.accountTypeID |
| email         | varchar |                                     |
| name          | varchar |                                     |

## TrainingSeries

| Name             | Type    | Details               |
| ---------------- | ------- | --------------------- |
| trainingSeriesID | int     | PK                    |
| title            | varchar |                       |
| userID           | int     | FK - refs User.userID |

## TeamMember

| Name           | Type    | Details               |
| -------------- | ------- | --------------------- |
| teamMemberID   | int     | PK                    |
| firstName      | varchar |                       |
| lastName       | varchar |                       |
| jobDescription | varchar |                       |
| email          | varchar |                       |
| phoneNumber    | varchar |                       |
| userID         | int     | FK - refs User.userID |

## Post

| Name             | Type    | Details                                   |
| ---------------- | ------- | ----------------------------------------- |
| postID           | int     | PK                                        |
| postName         | varchar |                                           |
| postDetails      | varchar |                                           |
| link             | varchar |                                           |
| daysFromStart    | int     |                                           |
| postImage        | varchar |                                           |
| trainingSeriesID | int     | FK - refs TrainingSeries.trainingSeriesID |

## accountType

| Name                 | Type    | Details |
| -------------------- | ------- | ------- |
| accountTypeID        | int     | PK      |
| accountType          | varchar |         |
| maxNotificationCount | int     |         |

## RelationalTable

| Name              | Type     | Details                                   |
| ----------------- | -------- | ----------------------------------------- |
| relationalTableID | int      | PK, auto-incremements                     |
| startDate         | datetime |                                           |
| trainingSeries_ID | int      | FK - refs TrainingSeries.trainingSeriesID |
| teamMember_ID     | int      | FK - refs TeamMember.teamMemberID         |

## Notifications

| Name           | Type     | Details |
| -------------- | -------- | ------- |
| notificationID | int      | PK      |
| sendDate       | date     |         |
| postName       | tinytext |         |
| post Details   | tinytext |         |
| link           | tinytext |         |
| phoneNumber    | varchar  |         |
| email          | varchar  |         |
| firstName      | varchar  |         |
| lastName       | varchar  |         |

[Back to table of Contents](#table-of-contents)

# Endpoints

## All endpoints

| Endpoint                                       | METHOD | Description                                              |
| ---------------------------------------------- | ------ | -------------------------------------------------------- |
| `/api/auth`                                    | POST   | Adds user to db (if they don't exist), returns user info |
| `/api/users/:id`                               | GET    | Gets all information about the current user by ID        |
| `/api/users/:id`                               | PUT    | Updates a user's information (in local db)               |
| `/api/users/:id`                               | DELETE | Deletes a user's information (in local db)               |
| `/api/users/:id/training-series`               | GET    | Gets all training series created by logged in user       |
| `/api/users/:id/team-members`                  | GET    | Gets all team members added by logged in user            |
| `/api/training-series`                         | POST   | Creates a new training series for logged in user         |
| `/api/training-series/:id`                     | GET    | Gets a specific training series by ID                    |
| `/api/training-series/:id`                     | PUT    | Edits a specific training series                         |
| `/api/training-series/:id`                     | DELETE | Deletes a specified training series                      |
| `/api/training-series/:id/posts`               | GET    | Gets all posts related to a training series              |
| `/api/posts`                                   | POST   | Adds a post to a training series                         |
| `/api/posts/:id`                               | GET    | Gets a specific post by ID                               |
| `/api/posts/:id`                               | PUT    | Updates a post                                           |
| `/api/posts/:id`                               | DELETE | Deletes a post                                           |
| `/api/team-members`                            | POST   | Creates a new team member                                |
| `/api/team-members/:id`                        | GET    | Gets a specific team member                              |
| `/api/team-members/:id`                        | PUT    | Edits a specified team member                            |
| `/api/team-members/:id`                        | DELETE | Deletes a specified team member                          |
| `/api/team-members/:id/training-series`        | POST   | Assigns a member's training series start date            |
| `/api/team-members/:id/training-series/:ts_id` | PUT    | Updates a member's training series start date            |
| `/api/team-members/:id/training-series/:ts_id` | DELETE | Deletes a member's training series start date            |
| `/api/stripe`                                  | POST   | Registers user with stripe & Submit payment              |
| `/api/stripe/unsubscribe`                      | POST   | Unsubscribes a user from their subscription              |

# Data requests and responses

# 🖥 Data requests and responses 🖥

Below are all expected request body shapes and data responses

## `/api/auth`

**Method:** POST

Structure of request object (if registering for first time):

```
{
    email: "example@email.com" // required
    name: "John Doe" // required
}
```

**HTTP Status:** 201 Created

Structure of response:

```
{
    message: "Account created successfully",
    newUser
}
```

Structure of request object (if already registered):

```
{
    email: "example@email.com" // required
    name: "John Doe"
}
```

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "Login successful",
    user,
    trainingSeries
}
```

[Back to table of Contents](#table-of-contents)

## `/api/users/:id`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    user,
    account,
    members,
    userTrainingSeries,
    posts
}
```

**Method:** PUT

Structure of request object:

```
{
    name: "John Doe",
    email: "example@email.com"
}
```

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "Update successful",
    updatedUser
}
```

**Method:** DELETE

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "User account removed successfully"
}
```

## `/api/users/:id/training-series`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    userTrainingSeries
}
```

## `/api/users/:id/team-members`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    members
}
```

## `/api/training-series`

**Method:** POST

Structure of request object:

```
{
    title: "Lorem ipsum", // required
    userID: 1 // required
}
```

**HTTP Status:** 201 Created

Structure of response:

```
{
    newTrainingSeries
}
```

[Back to table of Contents](#table-of-contents)

## `/api/training-series/:id`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    trainingSeries
}
```

**Method:** PUT

Structure of request object:

```
{
    title: "Lorem ipsum"
}
```

**HTTP Status:** 200 OK

Structure of response:

```
{
    updatedTrainingSeries
}
```

**Method:** DELETE

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "The resource has been deleted"
}
```

## `/api/training-series/:id/posts`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    trainingSeries,
    posts
}
```

## `/api/posts`

**Method:** POST

Structure of request object:

```
{
    postName: "Lorem ipsum", // required
    postDetails: "Lorem ipsum dolor", // required
    link: <url>, // required
    daysFromStart: 2, // required
    trainingSeriesID: 1, // required
    postImage: <url>
}
```

**HTTP Status:** 201 Created

Structure of response:

```
{
    newPost
}
```

## `/api/posts/:id`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    post
}
```

**Method:** PUT

Structure of request object:

```
{
    postName: "Lorem ipsum",
    postDetails: "Lorem ipsum dolor",
    link: <url>,
    daysFromStart: 2,
    trainingSeriesID: 1,
    postImage: <url>
}
```

**HTTP Status:** 200 OK

Structure of response:

```
{
    updatedPost
}
```

**Method:** DELETE

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "The resource has been deleted."
}
```

[Back to table of Contents](#table-of-contents)

## `/api/team-members`

**Method:** POST

Structure of request object:

```
{
    firstName: "John", // required
    lastName: "Doe", // required
    jobDescription: "Produce", // required
    email: "example@email.com", // required
    phoneNumber: "424-242-4242", // required
    user_ID: 1 // required
}
```

**HTTP Status:** 201 Created

Structure of response:

```
{
    newTeamMember
}
```

## `/api/team-members/:id`

**Method:** GET

**HTTP Status:** 200 OK

Structure of response:

```
{
    teamMember,
    assignments
}
```

**Method:** PUT

Structure of request object:

```
{
    firstName: "John",
    lastName: "Doe",
    jobDescription: "Produce",
    email: "example@email.com",
    phoneNumber: "424-242-4242",
    user_ID: 1
}
```

**HTTP Status:** 200 OK

Structure of response:

```
{
    updatedTeamMember
}
```

**Method:** DELETE

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "The resource has been deleted."
}
```

## `/api/team-members/assign`

**Method:** POST

Structure of request object:

```
{
    trainingSeriesID: 2, // required
    startDate: "2019-12-20", // required, date in ISO format (use .toISOString())
    assignments: [51, 72, 123] // required, each index is a teamMemberID
}
```

**HTTP Status:** 201 Created

Structure of response:

```
{
    message: "The team member has been assigned to the training series."
}
```

[Back to table of Contents](#table-of-contents)

## `/api/team-members/assign/:id`

**Method:** DELETE

**HTTP Status:** 200 OK

Structure of response:

```
{
    message: "The resource has been deleted."
}
```

## `/api/stripe`

**Method:** POST

Structure of request object:

```
{
    token: '' // required - token created on front end by stripe
    name: 'Michael Landers' // required
    email: 'landers.mike@gmail.com' // required
    userID: 64 // required
    stripe: 'cus_Em0HrDDkcniQIi' // required
}
```

**HTTP Status:** 200 OK

<!-- Structure of response:

```
{
    message: "Successfully updated team member's start date",
    updates
}
``` -->

## `/api/stripe/unsubscribe`

**Method:** POST

Structure of request object:

```
{
    userID: 64 // required
    stripe: 'cus_Em0HrDDkcniQIi' // required
}
```

**HTTP Status:** 200 OK

<!-- Structure of response:

```
{
    message: "Successfully updated team member's start date",
    updates
}
``` -->

[Back to table of Contents](#table-of-contents)
