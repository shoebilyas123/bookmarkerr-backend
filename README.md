# Bookmarkerr App Backend

This is the backend server that includes auth handling for the bookmarkerr app. More on bookmarkerr [here]().

### Folder Structure

The `src` is the root folder that contains all the program logic and server code. The root directory contains the necessary configuration files. The structure listed below is of the `src` folder.

- `controllers`: Every file exports the route handler for the associated routes defined in the their respective files under the routes folder.
- `lib`: Contains the helper and utility functions.
- `middleware`: As the name suggests, router middlewares exist here.
- `models`: Every file under this folder defines a schema and exports the model based on that schema.
- `routes`: As mentioned earlier, defines routes.
- `app.ts`: This file imports express, configures our app router and exports it to be used elsewhere in the app. The app has been separated from index file for better readablity and code modularity.

### Architecture:

The app is written in TypeScript and ExpressJS. Here are the list of libraries the server utilizes the following libraries

- Server: [Express](https://expressjs.com/)
- Form Validation: [Zod](zod.dev/)
- Database: [MongoDB](https://www.mongodb.com/docs/manual/installation/)
- Auth Token: [Json Web Token](https://jwt.io/introduction)
