## This is the backend of the application

In the package.json there are several configured commands
to run with `npm run`

Some of them are:

### `npm install`

Installs dependencies

### `npm start`

Starts the server

There's no need to run these commands here if you run the two commands said in the README.md of the root folder of this repository, they take care of both backend and frontend

---

This project uses Nodejs and Postgresql, the other dependencies
can be installed with npm

Before running the backend it's important to set some environment variables
or instead to create a file called `env.json` here inside the api folder

This file (or the related env variable) exports some important information used by the application server

The format of the file is as follow:

```json
{
  "googleClientId": [
    "googleClientIdBg2maPe86OWE.apps.googleusercontent.com"
  ],
  "gmailAuth": {
    "email": "optional@gmail.support",
    "pass": "optionalgmailpassword"
  },
  "secret": "somesecret",
  "adminEmail": "admin@email.tld",
  "adminPassword": "password"
}
```

`googleClientId` is for the Google login feature (the application might run fine without it)

For the Gmail integration, you have to set the account you use here to permit Less secure app access. And even so, sometimes it might not even work. It might depend on the location you deploy the application

When not using the Gmail integration, leave the property with an empty object like this: `"gmailAuth": {}`


The admin account is created when running `npm run seed-db`

After you configured the Postgresql access in the `config/config.json` you should be good to go
