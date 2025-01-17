# Express Project with TypeScript Setup

This guide will walk you through the steps to set up an Express server project with TypeScript.

## Prerequisites

Before starting, make sure you have the following installed on your system:

-   Node.js
-   npm (Node Package Manager)

## Steps to Set Up the Project

### 1. Create the Project Directory

```bash
mkdir server
cd server
```

### 2. Initialize npm Project

Run the following command to create a package.json file for your project:

```bash
npm init -y
```

### 3. Install TypeScript and Development Dependencies

Install TypeScript, ts-node, and the required Node.js type definitions:

```bash
npm install -D ts-node typescript @types/node
```

### 4. Initialize TypeScript Configuration

Run the following command to generate a tsconfig.json file:

```bash
npx tsc --init
```

### 5. Modify the `tsconfig.json`

Modify the generated tsconfig.json file with the following settings:

```bash
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### 6. Install Express and Additional Dependencies

Install the necessary packages for building the Express server:

```bash
npm install express body-parser dotenv helmet morgan
```

Install development dependencies like `rimraf`, `concurrently`, `nodemon`, and the types for `Express` and `Morgan`:

```bash
npm install -D rimraf concurrently nodemon @types/cors @types/express @types/morgan @types/node
```

### 7. Add Scripts for Building and Running the Application

In your `package.json`, modify the scripts section to include the following commands:

```bash
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "rimraf dist && tsc",
  "start": "npm run build && node dist/index.js",
  "dev": "npm run build && concurrently \"tsc -w\" \"nodemon --exec ts-node src/index.ts\""
}
```

### 8. Folder Structure

Your project directory structure should now look like this:

```bash
server/
├── dist/           # Compiled JavaScript files (output folder)
├── node_modules/   # Installed dependencies
├── src/            # TypeScript source files
│   └── index.ts    # Main entry point of your Express app
├── package.json    # Project configuration
├── tsconfig.json   # TypeScript configuration
└── package-lock.json # Lockfile for dependencies
```

### 9. Create the src/index.ts File

Create the src/index.ts file to set up a basic Express server:

```bash
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.get("/", (req, res) => {
    res.send("Hello World!!!!");
});

// SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

```

### 10. Running the Application

_Development Mode_
To run the server in development mode (with live reloading):

```bash
npm run dev
```

_Production Mode_
To build and run the server in production mode:

```bash
npm run build
npm start
```

Your Express server is now set up with TypeScript! You can now expand on this setup by adding routes, middleware, and other features as needed for your application.
