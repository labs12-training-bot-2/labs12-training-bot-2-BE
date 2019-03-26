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

(FK's not accounted for in tables yet)
## User
| Name  | Type    |
| ----- | ------- |
| id    | int     |
| email | varchar |

## Training Series

 | Column A       | Column B |
 | -------------- | -------- |
 | trainingId     | int      |
 | trainingSeries | varchar  |
 | title          | varchar  |


## Team Member

| Name           | Type    |
| -------------- | ------- |
| teamMemberId   | int     |
| firstName      | varchar |
| lastName       | varchar |
| jobDescription | varchar |
| email          | varchar |
| phoneNumber    | varchar |

## Post
| Name        | Type    |
| ----------- | ------- |
| postId      | int     |
| postDetails | varchar |
| link        | varchar |
| startDate   | date    |
| postImage   | varchar |

## Account Type

| Name                 | Type    |
| -------------------- | ------- |
| idAccountType        | int     |
| accountType          | varchar |
| maxNotificationCount | int     |

## Relational Table

| Name              | Type |
| ----------------- | ---- |
| idRelationalTable | int  |
| startDate         | date |

[Back to table of Contents](#table-of-contents)





 
# Endpoints

## All endpoints
| METHOD | endpoint                         | description                                        |
| ------ | -------------------------------- | -------------------------------------------------- |
| POST   | `/api/auth`                      | Register or logs user in via Auth0                 |
| POST   | ENDPOINT HERE                    | Adds user to database and returns user ID          |
| GET    | `/api/users/:id`                 | Gets all information about the current user by ID  |
| PUT    | ENDPOINT HERE                    | Updates a user's information (in local db)         |
| DELETE | ENDPOINT HERE                    | Deletes a user's information (in local db)         |
| GET    | `/api/users/:id/training-series` | Gets all training series created by logged in user |
| GET    | `/api/training-series/:id`       | Gets a specific training series by ID              |
| POST   | `/api/training-series`           | Creates a new training series for logged in user   |
| PUT    | `/api/training-series/:id`       | Edits a specific training series                   |
| DELETE | `/api/training-series/:id`       | Deletes a specified training series                |
| GET    | `/api/training-series/:id/posts` | Gets all posts related to a training series        |
| GET    | `/api/posts/:id`                 | Gets a specific post by ID                         |
| POST   | `/api/posts`                     | Adds a post to a training series                   |
| PUT    | `/api/posts/:id`                 | Updates a post                                     |
| DELETE | `/api/posts/:id`                 | Deletes a post                                     |
| GET    | `/api/users/:id/team-members`    | Gets all team members added by logged in user      |
| GET    | `/api/team-members/:id`          | Gets a specific team member                        |
| POST   | `/api/team-members`              | Creates a new team member                          |
| PUT    | `/api/team-members/:id`          | Edits a specified team member                      |
| DELETE | `/api/team-members/:id`          | Deletes a specified team member                    |
| POST   | ENDPOINT HERE                    | Assigns a member's training series start date      |
| PUT    | ENDPOINT HERE                    | Updates a member's training series start date      |
| DELETE | ENDPOINT HERE                    | Deletes a member's training series start date      |
| PUT    | ENDPOINT HERE                    | Updates a user's account type (subscription)       |
| DELETE | ENDPOINT HERE                    | Delete's a user account type (upon account del)    |


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
