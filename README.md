# Chat-app API

## Overview

Chat-app is a REST-based API for a chat application that supports real-time user chat, group chat, user authentication, and profile management. Built with Nest.js and TypeScript, it provides an easy-to-use interface for developers to integrate chat functionality into their applications.

## Features

- **User Chat**: Real-time direct messaging between users.
- **Group Chat**: Create and manage group chats for multiple users.
- **User Authentication**: Secure login and registration using Passport.js and Express-Session.
- **Profile Management**: Update and manage user profiles.
- **Search Functionality**: Search through users and groups.
- **Group Management**: Manage group membership and roles.

## Technologies Used

- **Nest.js**: Framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Prisma**: ORM used for interacting with PostgreSQL database.
- **Passport.js**: Authentication middleware for handling user login and registration.
- **Express-Session**: Session management for secure user authentication.

## Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (version 20.x or above)
- **PostgreSQL**: The database used by the application.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/NatiG100/chat-app-api
   cd chat-app-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of your project and define the following environment variables:

   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>?schema=public"
   UPLOADCARE_SECRETE=<your_uploadcare_secret>
   UPLOADCARE_PUBLIC=<your_uploadcare_public_key>
   NODE_OPTIONS="--max-old-space-size=4096"
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the application:**
   ```bash
   npm run start:dev
   ```

## API Documentation

You can explore the full API documentation and endpoints using [Postman](https://galactic-sunset-444021.postman.co/workspace/chat-app~0999d381-0cf2-476c-aefc-c96d4273c87a/overview).

## Technologies and Tools

- **Nest.js**: Server-side framework used to build scalable APIs.
- **TypeScript**: Language for writing safe and scalable code.
- **Prisma**: ORM for PostgreSQL database interaction.
- **Passport.js**: Middleware for authentication.
- **Express-Session**: Used for session management in authentication.

## Contributing and Support

- **Contributions**: This project does not currently accept contributions.
- **Issues/Support**: If you encounter any issues or need further assistance, please reach out to:  
  **Email**: natnaelgashu2022@gmail.com

## License

This project is licensed under the MIT License.
