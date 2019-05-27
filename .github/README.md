# Training Bot API

![banner](img/logo.png)

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> An Express + Node.js API for Training Bot

## Table of Contents

- [Background](#background)
- [Deploy](#Deploy)
- [API](#api)
  - [Authentication](#Authentication)
  - [Resources](#Resources)
    - [Auth](#Auth)
    - [Users](#Users)
    - [Team Members](#Team-Members)
    - [Training Series](#Training-Series)
    - [Messages](#Messages)
    - [Stripe](#Stripe)
    - [Slack](#Slack)
    - [Notifications](#Notifications)
    - [Responses](#Responses)
- [Maintainers](#maintainers)
- [License](#license)

## Background

TODO: Write background section

## Deploy

This project has an `app.json` file, which allows us to offer "one-click deployment" to Heroku. This will allow you to get your own version of Training Bot up and running both quickly and painlessly.

**NOTE:** Before clicking the button below you'll want to make sure you've completed the [prerequisite setup steps](../docs/prerequisites.md) in the [complete documentation](../docs/README.md).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/)

## API

### Authentication

Most routes require authentication, and Training Bot handles authentication by looking for a valid JWT's on the `Authorization` header of a given request.

Valid JWTs are provided by the Auth0 integration with our [React application](https://github.com/labs12-training-bot-2/labs12-training-bot-2-FE). However -- for testing -- You can get a token programattically using the [Auth0 Management API](https://auth0.com/docs/api/management/v2/get-access-tokens-for-test).

---

### Resources

#### Auth

| route       | methods | description                                              |                                                        Docs                                                         |
| :---------- | :-----: | :------------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------: |
| `api/auth/` |  POST   | Takes a valid JWT provided by Auth0 and logs the user in | [JS Docs](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/auth.js#L9-L65) |

---

#### Users

| route           | methods | description                                       |                                                        Docs                                                        |
| :-------------- | :-----: | :------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------: |
| `api/users/:id` | DELETE  | Deletes a specific user based on the ID parameter | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/user.js#L7-L31) |

---

#### Team Members

| route                                  |     methods      | description                                                                                                                      |                                                            Docs                                                             |
| :------------------------------------- | :--------------: | :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------: |
| `api/team-members/`                    |    GET, POST     | Get all Team Members associated with an authenticated User and/or Create a new Team Member associated with an authenticated User | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L58-L143)  |
| `api/team-members/:id`                 | GET, PUT, DELETE | Read, Update, and Delete specific Team Members                                                                                   | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L57-L141)  |
| `api/team-members/:id/unassign/:ts_id` |      DELETE      | Unassign a specified Team Member from a Training Series                                                                          | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L144-L213) |

---

#### Training Series

| route                               |      methods      | description                                                                                                                                 |                                                              Docs                                                               |
| :---------------------------------- | :---------------: | :------------------------------------------------------------------------------------------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------: |
| `api/training-series/`              |     GET, POST     | Get all the training series associated with an authenticated User and/or Create a new training series associated with an authenticated User |  [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/trainingSeries.js#L15-L53)  |
| `api/training-series/:id`           | GET, POST, DELETE | Read, Update, and Delete specific training series                                                                                           | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/trainingSeries.js#L55-L140)  |
| `api/training-series/:id/messages`  |        GET        | Get all the messages for a specific training series                                                                                         | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/trainingSeries.js#L142-L170) |
| `api/training-series/:id/assignees` |        GET        | Get the team members for the specific training series                                                                                       | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/trainingSeries.js#L172-L215) |

---

#### Messages

| route              |     methods      | description                                                                                                              |                                                          Docs                                                           |
| :----------------- | :--------------: | :----------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------: |
| `api/messages/`    |    GET, POST     | Get all Messages associated with an authenticated User and/or Create a new Message associated with an authenticated User | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/message.js#L13-L66)  |
| `api/messages/:id` | GET, PUT, DELETE | Read, Update, and Delete specific Messages                                                                               | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/message.js#L68-L165) |

---

#### Stripe

| route                      | methods | description                                                                   |                                                          Docs                                                           |
| :------------------------- | :-----: | :---------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------: |
| `api/stripe/`              |  POST   | allows user to update/change their stripe plan.                               | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L120-L168) |
| `api/stripe/register`      |  POST   | register the user with stripe's API to get a stripe ID                        | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L169-L198) |
| `api/stripe/unsubscribe`   |  POST   | allows user to unsubscribe from their current plan.                           | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L200-L223) |
| `api/stripe/plans`         |   GET   | allows user to see available plans (basic, premium, pro)                      | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L225-L256) |
| `api/stripe/subscriptions` |   GET   | Allows the user to access the three subscription that go with the three plans | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L257-L278) |
| `api/stripe/customer/plan` |   GET   | Shows the user what their current plan is                                     | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L279-L294) |
| `api/stripe/paymentintent` |  POST   | required by the stripe API to be able to collect credit card payments.        | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/stripe.js#L296-L316) |

---

#### Slack

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/slack/oauth` | POST | Creates authenticated Slack Token in the database after oauth validation | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/slack.js#L24-L60) |
| `api/slack/` | GET | Get all Slack users from the authenticated Slack workspace | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/slack.js#L62-L95)  |
| `api/slack/:id/history` | GET | Get all messages in specific DM chat history with specified Team Member | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/slack.js#L97-L138) |
| `api/slack/sendMessageNow` | POST | Bypass Notification timer and immediately send specified Team Member a Slack Message, for testing purposes only | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/slack.js#L140-L208) |

---

#### Notifications

| route                            |  methods  | description                                                                                                                        |                                                             Docs                                                              |
| :------------------------------- | :-------: | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------: |
| `api/notifications/`             | GET, POST | Get all Notifications associated with an authenticated User and/or Create a new Notification associated with an authenticated User |  [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L15-L80)  |
| `api/notifications/:id`          |    GET    | Get specific Notifications                                                                                                         | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L82-L109)  |
| `api/notifications/:id/response` |    GET    | Get all Responses associated with an authenticated User for specific Notification                                                  | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L111-L143) |
| `api/notifications/:id/delete`   |  DELETE   | Delete specific Notifications                                                                                                      | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L145-L167) |

---


#### Responses

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/responses` | GET | Get all Responses for authenticated User | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/responses.js#L22-L40) |
| `api/responses/:id` | GET, DELETE | Get or delete specific Response | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/responses.js#L42-L91) |
| `api/responses/email` | POST | Create a new email Response | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/responses.js#L93-L159)  |
| `api/responses/sms` | POST | Create a new text Response | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/responses.js#L161-L212)  |
| `api/responses/slack` | POST | Create a new Slack Response | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/responses.js#L214-L264)  |

---

## Maintainers

| ![Andrew Brush](https://github.com/ajb85.png) | ![Nick Cannariato](https://github.com/nickcannariato.png) | ![Adam McKenney](https://github.com/DaftBeowulf.png) | ![Gannon Darcy](https://github.com/GannonDetroit.png) | ![Thomas Hessburg](https://github.com/TomHessburg.png) |
| --------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| [@ajb85](https://github.com/ajb85) | [@nickcannariato](https://github.com/nickcannariato) | [@DaftBeowulf](https://github.com/DaftBeowulf) | [@GannonDetroit](https://github.com/GannonDetroit) | [@TomHessburg](https://github.com/TomHessburg)         |



## License

MIT © 2019 Training Bot
