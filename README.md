# UruIT - Game Of Drones - API 🔥

[![CircleCI](https://circleci.com/gh/Darking360/uruit-recruitment-test-backend.svg?style=svg&circle-token=c40838322f4e49fb29e16470760c3b6c26884181)](https://circleci.com/gh/Darking360/uruit-recruitment-test-backend)

This project is the backend part of the 2 parts of the test, the other repo contains all the App related logic, it can be found here: [UruIT - Game of Drones - App](https://github.com/Darking360/uruit-recruitment-test-frontend).

## Instructions to run 🐋

In this house we believe in our god Docker 🐋 so all the project is easy to setup with it, so follow this simple steps:

- Clone the project
- Go to the project's directory
- Run the project with docker compose to build the complete app, use sudo if you need permissions on your machine like this:

```
docker-compose up
```

Or

```
sudo docker-compose up
```

And that's it, you should get an app running on port 3001, and accesible by going into: [http://localhost:3000](http://localhost:3000).

## But I don't like docker 😭

It's important to note here that you need to be running mongoDB in your local machine if you're going to take this path (please, user docker 🐋). You need to export an environment variable containing the complete URI to your mongoDB install on your machine like:

```
export MONGO_URI=mongodb://localhost:27017
```

Or whatever your mongoDB URI is.

After that, we got you covered, if you don't want to use it you can install all with a classic `npm install` and you're ready, like this:

- Clone the project
- Go to the project's directory
- Run npm install
- Run npm start

And that's it 💡

## Where are the tests? 👀

You can run the tests wit docker or npm by itself running:

```
docker-compose run api npm run test
```

Or

```
sudo docker-compose run api npm run test
```

Or

```
npm run test
```

Depending on your case 👀

## Project dependencies and versions

Besides the project `package.json` dependencies, we have this dependencies if you want to take a look:

| Technology        | Version            |
| ------------- |:-------------:|
| node      | ^11.10.0 |
| npm      | ^6.7.0      |
| docker | 18.03.0-ce, build 0520e24302      |
| docker-compose | version 1.20.1, build unknown      |
| mongoDB | ^4.0.0      |