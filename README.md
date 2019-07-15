# UruIT - Game Of Drones - API :fire:

This project is the backend part of the 2 parts of the test, the other repo contains all the App related logic, it can be found here: [UruIT - Game of Drones - App](https://lickaca.comp).

## Instructions to run

In this house we believe in our god Docker :whale: so all the project is easible setup with it, so follow this simple steps:

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

## But I don't like docker :cry:

It's important to note here that you need to be running mongoDB in your local machine if you're going to take this path (please, user docker :whale:). You need to export an environment variable containing the complete URI to your mongoDB install on your machine like:

```
export MONGO_URI=mongodb://localhost:27017
```

Or whatever your mongoDB URI is.

After that, we got you covered, if you don't want to use it you can install all with a classic `npm install` and you're ready, like this:

- Clone the project
- Go to the project's directory
- Run npm install
- Run npm start

And that's it :bulb:

## Where are the tests? :eyes:

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

Depending on your case :eyes:

## Project dependencies and versions

Besides the project `package.json` dependencies, we have this dependencies if you want to take a look:

// Table here