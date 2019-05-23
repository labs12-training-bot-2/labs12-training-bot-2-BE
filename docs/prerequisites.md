# Prerequisites

## Table of Contents

- [Intro](#intro)
  - [A note on creating the accounts](#a-note-on-creating-the-accounts)
  - [Generating your environment file](#generating-your-environment-file)
- [Auth0](#auth0)
  - [How Training Bot uses Auth0](#how-training-bot-uses-auth0)
  - [Configuring Auth0](#configuring-auth0)
- [SendGrid](#sendgrid)
  - [Configuring SendGrid](#configuring-sendgrid)
- [Slack](#slack)
- [Stripe](#stripe)
- [Twilio](#twilio)
  - [Configuring Twilio](#configuring-twilio)

## Intro

Before deploying or doing much of anything with Training Bot, you're going to need to set up some accounts with the third party services that Training Bot relies on.

This document will reflect where to go to create the accounts, what keys you will need, and a general overview of how they work with Training Bot.

### A note on creating the accounts

Resources during Lambda Labs are a little tight, and as such the app is pretty much designed to exist within the free tier of every service that it relies on. The negative of this is that most free tiers don't allow you to create a team and manage permissions in an industry standard/secure way.

The best way to handle this is to create a new Gmail account for this project and share the credentials for that account with your teammates. You'll then use _that_ email address to create accounts with the necessary services.

Speaking from experience, this will prevent a lot of headaches, like always having to wait on the one person with the login to heroku to deploy a specific branch or check the logs for errors.

# Generating your Environment file

Training Bot expects the passwords and private keys it needs will be in a file named `.env` in the root of the repository.

To this end, we've created a file named `.env.sample` in the root of the repository that contains the environment variables that training bot needs to function locally.

To create your own copy of this file in a single command, you can `cd` into your local repository and run:

```bash
cp .env.sample .env
```

You'll then need to add your assorted keys and passwords to the .env file where they're requested. See the [prerequisites](prerequisites.md) documentation if you're not sure which keys you need.

## Auth0

- [Official Site](https://auth0.com/)
- [Developer Docs](https://auth0.com/docs)

[Auth0](https://auth0.com/) is a universal authentication and authorization service that Training Bot uses to authenticate users to the application and also to register new users.

### How Training Bot uses Auth0

1. User clicks "Log in" in the React app
2. The React app redirects the user to the Auth0 login screen, and passes Auth0 a callback URL as a query string on the request
3. The user selects which third-party service they'd like to authenticate with (Google, LinkedIn, Facebook)
4. The User is redirected from Auth0 to the third party service they selected to Authorize our application to create a user on their behalf
5. Auth0 catches the OAuth tokens from the third party services and creates a user record inside their application
6. Auth0 generates a JWT for that user, then redirects the user to the callback URL supplied initially by our application
7. Our application accepts the token, creates a new User record in our database based on the information in the token, and then stores the JWT in the user's local storage.
8. When the user attempts to access any route, we pull that ID token from local storage and include it as a header named "Authorization", the API decrypts this token and verifies that the user has the appropriate Authorization to access a given resource.

### Configuring Auth0

1. [Create an account on Auth0](https://auth0.com/signup) using the Labs team email you created before setting these services up (you did that, right?)
2. Auth0 will ask you to set up your tennant domain. This can be anything you want it to be, but it isn't changeable so I would recommend something like `training-bot-VERSION`. For example, our tennant domain was `training-bot-2`, since we're the second iteration of the application.
3. Auth0 will then ask you some demographic questions. Your "Account Type" should be "Personal", your "Role" should be Developer, and your "Project" should be "Application for consumers (B2C)"
4. Click "Create Account", If all goes well, you'll be redirected to your dashboard
5. From your Dashboard, click the orange "Create Application" button in the top right hand side.
6. You can name your application anything you want, but "Training Bot" is probably a good idea. Once you've picked a name, select "Single Page Web Application" as the type and click "Create"
7. Ignore the "Quick Start" options and click "Settings" on the toolbar under your application header.
8. On the "Settings" page, scroll down to "Application Logo" and paste this link: `https://i.imgur.com/izl59sH.png`. This will pull in your image for the authentication screen.
9. Now scroll to "Allowed Callback URLs". This is a security feature designed so that Auth0 will only send credentials to approved callback URLs. For now, you want to put `http://localhost:3000/callback`, but later you'll add the domain of your deployed Netlify URL along side that, leaving it looking like `http://localhost:3000/callback,https://NETLIFY_URL/callback`
10. Scroll to the bottom of that page and click "Save Changes"
11. Click on the "Connections" menu item on the sidebar menu, and then click "Database" from the list of options.
12. On the Database page, you'll see a settings cog next to "Username-Password-Authentication". Training Bot doesn't allow email/password authentication, so you'll want to click that settings cog, scroll down to the bottom of that page, and click the red "Delete" button.
13. Once that's done, you'll want to click on the "Social" option under the "Connections" menu item on the sidebar menu, which will navigate you to the Social Connections page.
14. On this page, you'll want to enable any third party services that you'd like to allow users to authenticate with. For now, you don't need to worry to much about configuration, and can use the Dev keys until you decide what you want to do for production.
15. Go back to your settings page for your Auth0 application, you'll need the "domain", and "client ID" information
16. Copy that data, and replace the existing values in the `src/Auth/auth0-variables.js` file in the Front End repository with your domain and client ID data.
17. You've now set up Auth0 with Training Bot! Make sure to come back later and add the Netlify callback URL to the "Allowed callback URL" option in settings.

## SendGrid

- [Official Site](https://sendgrid.com/)
- [Developer Docs](https://sendgrid.com/docs/)

[Sendgrid](https://sendgrid.com/) is a Marketing and Transactional email service used by developers around the world. Training Bot uses it to send email notifications out to the appropriate people.

### Configuring SendGrid

**\*Note**: To configure sendgrid correctly, you'll need to have a custom domain. Talk with your PM about getting one from NameCheap using Lambda's resources\*

1. [Create a "Free" account on SendGrid](https://sendgrid.com/pricing/) using your Labs team email
2. Navigate to the [Sender Authentication](https://app.sendgrid.com/settings/sender_auth) page, and click "Authenticate your domain". It will then walk you through adding the appropriate DNS records to your domain so that SendGrid can send mail on your behalf.
3. Now that your domain is configured, navigate to the [Transactional Templates](https://sendgrid.com/dynamic_templates) page, and click "Create Template"
4. Create a template named "training_bot_notification" and click "Save"
5. Copy the "ID" under your newly created template group, and paste it into the `jobs/notifications/lib/senders/email` file as the value for the "templateId" property in the object being passed to the `sgMail.send()` function.
6. Back in the SendGrid GUI, click "add version" to start adding a template version; then select "Code Editor" as your experience and click "Continue" on the top right.
7. Paste the code in [this gist](https://gist.github.com/nickcannariato/c090975c2a0ac415d175c5d1d4544b60) into the code editor, then hit the "Save Template" button on the header bar.
8. Now navigate to the [API Keys page in your settings](https://app.sendgrid.com/settings/api_keys) and click "Create API Key" on the top right.
9. Name your API key "training_bot", select "Full Access" (unless you want to customize or restrict the permissions for that key) and click "Create and View"
10. Copy the API key that SendGrid displays and paste it into your `.env` file as the value for the `SENDGRID_API_KEY` variable.
11. Congrats! You're done!

## Slack

[Slack API Docs](https://api.slack.com/)
[Slack Workspace](https://slack.com/signin)

### Create a new Slack App

1. [Create a Slack workspace](https://slack.com/create) your team can use to test the bot. Use your team's email account when creating. Follow the prompts and optionally add your teammates to the workspace. Once you're loaded in Slack, it's time to create the Slack App
2. [Starting from the API linked above](https://api.slack.com/), click on the "Start Building" button
3. Name your app (I would suggest Training Bot) and select the workspace you just created in the Development Slack Workspace field then click "Create App"
4. From the buttons listed in the "Add features and functionality", click on "Bots" and then "Add a Bot User". The default display name and default username should be fine but you're welcome to change them if you'd like. "Always Show My Bot as Online" is your personal choice. Once you're happy with the settings, click on "Add Bot User"
5. Once you see "Success!" at the top, click on Basic Information on the top left and drop down "Add features and functionality" and click on Permissions. Scroll down to Scopes and add the following permissions: channels:history, channels:read, chat:write:bot, groups:history, im:history, im:write, mpim:history, users:read. Once you're done, don't forget to click "Save Changes" at the bottom!
6. Scroll back to the top and notice the two access tokens. _NEVER_ use "OAuth Access Token" since that one is for you, the user. However, if you want to run some tests with your bot, you can "Bot User OAuth Access Token" to access it.  We no longer use this in the code however, as you should be able to authorize your own custom bot with the Training Bot code.  In other words, you won't need this token unless you are going out of your way to test something outside of the code base.
7. Back in Basic Information on the Slack API site, look in the App Credentials section for Client ID, Client Secret, and Verification Token. Copy those to environment variables as follows: SLACK_CLIENT_ID=PASTE_CLIENT_ID_HERE, SLACK_SECRET=PASTE_CLIENT_SECRET_HERE, SLACK_VERIFICATION=PASTE_VERIFICATION_TOKEN_HERE. After oauth verification, Slack will want the client ID and Secret as extra precautions. However, the Verification Token is used with web hooks and since those requests come from the outside, Slack is going to send that token to you as proof of a legit request.
8. Once you have all your environment variables, you need to tell Slack how to redirect users back to you after they authorize Slack, which you do under "Redirect URL". You can find it on the left side under the "Features" section in "OAuth & Permissions". If you're running local tests then you can set it to "http://localhost:3000/slack-callback" but once your frontend and backend are live, set it to "https://YOUR_APP_URL.netlify.com/slack-callback". Slack will want this url as part of the oauth process so make sure you have one last environment variable on the backend: APP_BASE_URL=http://localhost:3000 (use this locally, update to your live URL on Netlify)
9. Next, you need to setup webhooks to receive responses. Basic Information --> Add Features and Functionality --> Event Subscriptions. Click on "Add Workspace Event" and add these scopes: message.im, message.mpim
10. Lastly, you need to tell Slack where it can send events when they trigger (your backend). Under Request URL, add a working URL to your backend and point it to the endpoint _https://YOUR_BACKEND_URL.heroku.com/api/responses/slack_ As soon as you type the URL, Slack is going to immediately send a challenge to that endpoint and expect the challenge back within a short time limit. If you are testing locally, you can use [ngrok](https://ngrok.com/download) to forward requests to your localhost. Otherwise, point it to your working Heroku backend and it should pass the challenge just fine.
11. Rejoice, you now have a working Slack bot!

## Stripe

## Twilio

- [Official Site](https://www.twilio.com/)
- [Developer Docs](https://www.twilio.com/docs/)

[Twilio](https://www.twilio.com/) is a messaging service that Training bot uses to send SMS messages.

### Configuring Twilio

1. [Create a Twilio account](https://www.twilio.com/try-twilio) using your Labs team email.
2. Verify a phone number with Twilio (this will be used to send text messages while your project is in Trial mode)
3. In the upper left hand corner, click the dropdown to the right of your email address, and then click "Create New Project" in the dropdown that appears.
4. Click the "Products" tab, select "Programmable SMS" and click the red "Continue" button
5. Name your project `training_bot`, and then click the red "Continue" button.
6. Click "Skip this step" on the invite teammates screen.
7. Click the red "Get Started" button in the Programmable SMS module on your dashboard.
8. Click the "Get a Number" link that appears in the Programmable SMS getting started docs.
9. Click the red "Choose this number" button in the popup that shows after they give you a number.
10. Copy the phone number that appears on the next screen into your `.env` file as the value for the `TWILIO_NUMBER` variable. (Should look like `+1XXXXXXXXXX`), and then click "Done"
11. [Navigate back to your console](https://www.twilio.com/console) and copy the "Account SID" string in the top left hand portion of your dashboard. Paste it into your `.env` file as the value for the `TWILIO_SID` variable.
12. Back in your Dashboard, click the "view" link next to "Auth Token" just under where you copied your "Account SID".
13. Copy the token that gets revealed into your `.env` fild as the value for the `TWILIO_TOKEN` variable
14. That's it! You're good to send SMS messages now.
