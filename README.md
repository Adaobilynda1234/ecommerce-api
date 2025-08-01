# E-commerce API

A RESTful API for an e-commerce application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Role-based access control (admin/customer)
- Product management (CRUD operations)
- Brands management(CRUD operations)
- JWT token authentication
- MongoDB Atlas database integration

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables
4. Start the server: `npm run dev`

## Configure Environment:

### Copy .env.example to .env and update:

```bash
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=<your-jwt-secret>
PORT=3000

```

## API Endpoints

### Authentication

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user

### Products

- GET `/products` - Get all products (public)
- POST `/products` - Add a product (admin only)
- DELETE `/products/:id` - Delete a product (admin only)
- GET `/products/:brandid/:page/:limit` - get a paginated products with brandid (public)

### Brands

- GET `/brands` - Get all brands (public)
- POST `/brands` - Add a brand (admin only)
- DELETE `/brands/:id` - Delete a brand (admin only)
- PUT `/brands/:id` - update a brand (admin only)

## Usage

Make sure MongoDB is running on your system, then:

```bash
npm run dev
```

## Hosted API On Render

[Visit Hosted API](https://ecommerce-api-yq6y.onrender.com/)

## Hosted Postman Documentation

[Visit API Documentation](https://documenter.getpostman.com/view/45518060/2sB34kEJfR)
