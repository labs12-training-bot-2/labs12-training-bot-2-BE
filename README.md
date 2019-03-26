# 💬 Training Bot API 💬

## Introduction
Training bot allows managers of teams to send notifications to their teammates on a predefined schedule.

## Table of Contents
- [💬 Training Bot API 💬](#%F0%9F%92%AC-training-bot-api-%F0%9F%92%AC)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
- [Overview](#overview)
  - [What is Training Bot? 🤖](#what-is-training-bot-%F0%9F%A4%96)
  - [Mission Statement 📜](#mission-statement-%F0%9F%93%9C)
- [Usage](#usage)
  - [Getting Started](#getting-started)
- [Database Tables](#database-tables)
  - [Schema](#schema)
  - [User](#user)
  - [Training Series](#training-series)
  - [Team Member](#team-member)
  - [Post](#post)
  - [Account Type](#account-type)
  - [Relational Table](#relational-table)
- [Endpoints](#endpoints)
  - [All endpoints](#all-endpoints)
- [Data responses](#data-responses)
  - [User - Registering & Logging in](#user---registering--logging-in)
    - [Upon a 200 request](#upon-a-200-request)
    - [Upon a 404 Request](#upon-a-404-request)
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

 | Name             | Type       | Details               |
 | ---------------- | ---------- | --------------------- |
 | trainingSeriesID | int        | PK                    |
 | title            | varchar    |                       |
 | userID           | int        | FK - refs User.userID |


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
| Name             | Type      | Details                                   |
| ---------------- | --------- | ----------------------------------------- |
| postID           | int       | PK                                        |
| postName         | varchar   |                                           |
| postDetails      | varchar   |                                           |
| link             | varchar   |                                           |
| startDate        | timestamp |                                           |
| postImage        | varchar   |                                           |
| trainingSeriesID | int       | FK - refs TrainingSeries.trainingSeriesID |

## accountType

| Name                 | Type    | Details |
| -------------------- | ------- | ------- |
| accountTypeID        | int     | PK      |
| accountType          | varchar |         |
| maxNotificationCount | int     |         |

## RelationalTable

| Name              | Type     | Details                                   |
| ----------------- | -------- | ----------------------------------------- |
| relationalTableID | int      | PK                                        |
| startDate         | datetime |                                           |
| trainingSeries_ID | int      | FK - refs TrainingSeries.trainingSeriesID |
| teamMember_ID     | int      | FK - refs TeamMember.teamMemberID         |

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
| `/api/training-series/:id`                     | GET    | Gets a specific training series by ID                    |
| `/api/training-series`                         | POST   | Creates a new training series for logged in user         |
| `/api/training-series/:id`                     | PUT    | Edits a specific training series                         |
| `/api/training-series/:id`                     | DELETE | Deletes a specified training series                      |
| `/api/training-series/:id/posts`               | GET    | Gets all posts related to a training series              |
| `/api/posts/:id`                               | GET    | Gets a specific post by ID                               |
| `/api/posts`                                   | POST   | Adds a post to a training series                         |
| `/api/posts/:id`                               | PUT    | Updates a post                                           |
| `/api/posts/:id`                               | DELETE | Deletes a post                                           |
| `/api/users/:id/team-members`                  | GET    | Gets all team members added by logged in user            |
| `/api/team-members/:id`                        | GET    | Gets a specific team member                              |
| `/api/team-members`                            | POST   | Creates a new team member                                |
| `/api/team-members/:id`                        | PUT    | Edits a specified team member                            |
| `/api/team-members/:id`                        | DELETE | Deletes a specified team member                          |
| `/api/team-members/:id/training-series`        | POST   | Assigns a member's training series start date            |
| `/api/team-members/:id/training-series/:ts_id` | PUT    | Updates a member's training series start date            |
| `/api/team-members/:id/training-series/:ts_id` | DELETE | Deletes a member's training series start date            |


# Data responses 
Below are all expected data responses

## User - Registering & Logging in
[Expected Data](#User)
### Upon a 200 request
```
{
    data sent back here
}
```
### Upon a 404 Request
```
{

}
```



[Back to table of Contents](#table-of-contents)
