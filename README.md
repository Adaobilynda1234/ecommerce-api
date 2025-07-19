# E-commerce API

A RESTful API for an e-commerce application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Role-based access control (admin/customer)
- Product management (CRUD operations)
- JWT token authentication
- MongoDB database integration

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables
4. Start the server: `npm run dev`

## API Endpoints

### Authentication

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user

### Products

- GET `/products` - Get all products (public)
- POST `/products` - Add a product (admin only)
- DELETE `/products/:id` - Delete a product (admin only)

## Usage

Make sure MongoDB is running on your system, then:

```bash
npm run dev
```

## Hosted Postman Documentation

[Visit API Documentation](https://documenter.getpostman.com/view/45518060/2sB34kEJfR)
