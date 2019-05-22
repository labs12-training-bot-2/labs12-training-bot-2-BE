# Setup

This document will explain what's needed to set up your local development environment, including some optional (but highly recommended) tools to speed your workflow up and improve the consistency of your code with the existing codebase.

## Table of Contents

- [Required tools](#required-tools)
  - [PostgreSQL](#postgresql)
- [Optional Tools](#optional-tools)
  - [Gitmoji CLI](#gitmoji-cli)
  - [Prettier](#prettier)

## Required tools

The following tools or pieces of software are required to set up a local developer environment for Training Bot.

### PostgreSQL

Both the development and production databases for Training Bot are designed for PostgreSQL. This means that in order to run the API locally, you'll need to install PostgreSQL on your system.

The reason for this is consistency, since Lambda Labs teams don't have a staging/dev server to work with, ensuring that your local devlopment database mirrors the production database is essential if you want to write the right code the first time.

You'll find install instructions for your system on the [official website](https://www.postgresql.org/). Once it's installed you'll need to create a database for your local system, and then put your database, your postgres username, and your postgres user password into your `.env` file.

## Optional tools

The following development tools are optional, but highly recommended.

### [Gitmoji-CLI](https://github.com/carloscuesta/gitmoji-cli)

The gitmoji-cli is a global npm package that will help you both categorize and form great commit messages using the [Gitmoji schema for commits](https://gitmoji.carloscuesta.me/). You can install it by running the following command in your terminal:

```bash
npm i -g gitmoji-cli
```

After it's installed, you'll want to `cd` into your local repository and configure it by running:

```bash
gitmoji --config
```

Gitmoji will then ask you a series of configuration questions. 

You'll want to say `n` to `Enable Automatic "git add ."`, choose "github" as the issue format, use the `:smile:` option for how to emojis should be used, and say `n` to `Enable signed commits` (unless you know what you're doing there and have a signing key set up with Git already).

After you're configured, you'll add the gitmoji hook to your local repository by running:

```bash
gimoji --init
```

After that, whenever you run `git commit` it will ask you a series of questions to form your commit message. The benefit of this is:

1. A better commit history
2. The ability to search your commit history by emoji to find a certain _type_ of change (i.e. `:fire:` to find places where code or files were deleted, which might have caused the weird bug you're now seeing :laughing:)

More detailed information on this can be found at [the package's official repository](https://github.com/carloscuesta/gitmoji-cli), and you can see how it was used on the Labs 12 version of Training Bot in [their repository](https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE)

# Prettier

[Prettier](https://prettier.io/) is an opinionated code formatter. The negative here is that it won't make any one person super happy because everyone will likely have _some_ issue with its opinions. The positive here is that it will guarantee that your team's code looks the same without having to set up a detailed linter or a bunch of rules. It has extensions for most editors and should be installable without issue.