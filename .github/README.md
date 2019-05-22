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

**NOTE:** Before clicking the button below you'll want to make sure you've completed the [prerequisite setup steps](../docs/01-prerequisites.md) in the [complete documentation](../docs/index.md).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/)

## API

### Authentication

Most routes require authentication, and Training Bot handles authentication by looking for a valid JWT's on the `Authorization` header of a given request.

Valid JWTs are provided by the Auth0 integration with our [React application](https://github.com/labs12-training-bot-2/labs12-training-bot-2-FE). However -- for testing -- You can get a token programattically using the [Auth0 Management API](https://auth0.com/docs/api/management/v2/get-access-tokens-for-test).

---

### Resources

#### Auth

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/auth/` |  POST   | Takes a valid JWT provided by Auth0 and logs the user in | [JS Docs](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/auth.js#L9-L65) |

---

#### Users

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/users/:id` | DELETE | Deletes a specific user based on the ID parameter | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/user.js#L7-L31) |

---

#### Team Members

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/team-members/`| GET, POST | Get all Team Members associated with an authenticated User and/or Create a new Team Member associated with an authenticated User |  [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L58-L143)  |
| `api/team-members/:id`| GET, PUT, DELETE | Read, Update, and Delete specific Team Members | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L57-L141)  |
| `api/team-members/:id/unassign/:ts_id`| DELETE | Unassign a specified Team Member from a Training Series | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/teamMember.js#L144-L213) |

---

#### Training Series

---

#### Messages

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/messages/` | GET, POST | Get all Messages associated with an authenticated User and/or Create a new Message associated with an authenticated User | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/message.js#L13-L66)  |
| `api/messages/:id` | GET, PUT, DELETE | Read, Update, and Delete specific Messages | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/message.js#L68-L165) |

---

#### Stripe

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

| route | methods | description | Docs |
|:--- | :---: | :--- | :---:|
| `api/notifications/` | GET, POST | Get all Notifications associated with an authenticated User and/or Create a new Notification associated with an authenticated User | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L15-L80) |
| `api/notifications/:id` | GET | Get specific Notifications | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L82-L109)  |
| `api/notifications/:id/response` | GET | Get all Responses associated with an authenticated User for specific Notification | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L111-L143) |
| `api/notifications/:id/delete` | DELETE | Delete specific Notifications | [JS Doc](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/controllers/notification.js#L145-L167) |

---

#### Responses

----

## Maintainers

| ![Andrew Brush](https://github.com/ajb85.png) | ![Nick Cannariato](https://github.com/nickcannariato.png) | ![Adam McKenney](https://github.com/DaftBeowulf.png) | ![Gannon Darcy](https://github.com/GannonDetroit.png) | ![Thomas Hessburg](https://github.com/TomHessburg.png) |
| --------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| [@ajb85](https://github.com/ajb85) | [@nickcannariato](https://github.com/nickcannariato) | [@DaftBeowulf](https://github.com/DaftBeowulf) | [@GannonDetroit](https://github.com/GannonDetroit) | [@TomHessburg](https://github.com/TomHessburg)         |

## License

MIT © 2019 Training Bot
