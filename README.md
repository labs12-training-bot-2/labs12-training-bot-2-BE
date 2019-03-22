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
![Schema Table](assets/Schema.png)

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
| Name                          | METHOD | endpoint      | description                                                |
| ----------------------------- | ------ | ------------- | ---------------------------------------------------------- |
| Register/Login                | POST   | `/api/auth`   | Register or logs user in                                   |
| Get all trainingSeries        | GET    | ENDPOINT HERE | Gets all training series associates to logged in user      |
| Get a specific trainingSeries | GET    | ENDPOINT HERE | Gets a specific training series                            |
| Create new trainingSeries     | POST   | ENDPOINT HERE | Creates a new training series for user currently logged in |
| Edit a trainingSeries         | PUT    | ENDPOINT HERE | Edits a specific training series                           |
| Delete a trainingSeries       | DELETE | ENDPOINT HERE | Deletes a specified training series                        |
| Get all team members          | GET    | ENDPOINT HERE | Gets all team members associates to logged in user         |
| Get a specific team member    | GET    | ENDPOINT HERE | Gets a specific team member                                |
| Create a new team member      | POST   | ENDPOINT HERE | Creates a new team member                                  |
| Edit team member              | PUT    | ENDPOINT HERE | Edits a specified team member                              |
| Delete a team member          | DELETE | ENDPOINT HERE | Deletes a specified team member                            |


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