# HuTube
### Video sharing platform 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Industry Standard Practices](#industry-standard-practices)
- [Dependencies](#dependencies)
- [Scripts](#scripts)
- [Author](#author)

## Introduction

MegaProject Backend is an industry-grade backend project built with Node.js and Express. It provides robust and scalable services for handling various backend operations, including user authentication, image uploading, and secure data handling. This project follows best practices in coding standards, file structure, and security to ensure a high-quality backend solution.

## Features

- User authentication with JWT
- Secure password handling with bcrypt
- Image uploading and management with Cloudinary
- Middleware support for cookies and CORS
- Database operations with Mongoose
- Aggregation and pagination for MongoDB collections
- File upload handling with Multer
- Static file serving
- Health check endpoint
- Code formatting with Prettier

## Installation

To get started with the MegaProject Backend, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/pmalu9211/Backend_Project.git
    cd Backend_Project
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    CORS_ORIGIN=url
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=your_access_token_expiry
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
    CLOUDINARY_CLOUD_NAME=name
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    ```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will start the server with `nodemon`, which will automatically reload the server when you make changes to the code.

## Model
Link to the model Model(https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Project Structure

The project follows a modular file structure for scalability and maintainability:

```
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── userController.js
│   │   ├── tweetController.js
│   │   ├── subscriptionController.js
│   │   ├── videoController.js
│   │   ├── commentController.js
│   │   ├── likeController.js
│   │   ├── playlistController.js
│   │   └── dashboardController.js
│   ├── middlewares
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── User.js
│   │   ├── Tweet.js
│   │   ├── Subscription.js
│   │   ├── Video.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Playlist.js
│   │   └── Dashboard.js
│   ├── routes
│   │   ├── user.routes.js
│   │   ├── tweet.routes.js
│   │   ├── subscription.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   └── dashboard.routes.js
│   ├── utils
│   │   └── helpers.js
│   ├── app.js
│   └── index.js
└── public
    └── images
```

## Environment Variables

The application uses the following environment variables:

- `PORT`: The port on which the server runs.
- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `JWT_SECRET`: The secret key for signing JSON Web Tokens.
- `CLOUDINARY_URL`: The URL for connecting to Cloudinary for image uploading.

## Industry Standard Practices

### Middleware

- **CORS**: Configured to allow requests from specified origins.
- **Body Parsers**: Configured to parse JSON and URL-encoded data with size limits for security.
- **Cookie Parser**: Used for handling cookies, which are essential for user preferences and authentication.
- **Static Files**: Serves static files from the `public` directory.

### Router

Routes are modularized to ensure a clean and maintainable codebase. Each module has its own router file:

- `/api/v1/healthcheck`: Health check endpoint.
- `/api/v1/users`: User-related operations (e.g., registration, login).
- `/api/v1/tweets`: Tweet-related operations.
- `/api/v1/subscriptions`: Subscription-related operations.
- `/api/v1/videos`: Video-related operations.
- `/api/v1/comments`: Comment-related operations.
- `/api/v1/likes`: Like-related operations.
- `/api/v1/playlist`: Playlist-related operations.
- `/api/v1/dashboard`: Dashboard-related operations.

### Security

- **JWT Authentication**: Secure token-based authentication.
- **Password Hashing**: Secure password storage using bcrypt.
- **Environment Variables**: Sensitive information is stored in environment variables.

## Dependencies

The project relies on the following main dependencies:

- `bcrypt`: For hashing passwords.
- `cloudinary`: For image uploading and management.
- `cookie-parser`: For parsing cookies.
- `cors`: For enabling CORS.
- `dotenv`: For managing environment variables.
- `express`: For building the web server.
- `jsonwebtoken`: For handling JSON Web Tokens.
- `mongoose`: For interacting with MongoDB.
- `mongoose-aggregate-paginate-v2`: For pagination of MongoDB aggregation results.
- `multer`: For handling file uploads.
- `prettier`: For code formatting.

## Scripts

- `dev`: Starts the development server with `nodemon` and loads environment variables from the `.env` file.

## Author

This project is maintained by Prathamesh Malu. Feel free to reach out for any queries or contributions.

---

Feel free to contribute to this project by opening issues or submitting pull requests. Any feedback or suggestions are highly appreciated!
