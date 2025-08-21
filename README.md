# E-commerce API

A RESTful API for an e-commerce application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Role-based access control (admin/customer)
- Product management (CRUD operations)
- Brands management (CRUD operations)
- Order management system
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
- GET `/products/:brandid/:page/:limit` - Get paginated products with brandid (public)

### Brands

- GET `/brands` - Get all brands (public)
- POST `/brands` - Add a brand (admin only)
- DELETE `/brands/:id` - Delete a brand (admin only)
- PUT `/brands/:id` - Update a brand (admin only)

### Orders

- POST `/orders` - Create a new order (customers only)
- GET `/orders` - Get all orders (admin only)
- GET `/orders/:id` - Get a specific order (admin only)
- PATCH `/orders/:id/status` - Update order status (admin only)
- PATCH `/orders/:orderId/items/:itemId/shipping-status` - Update item shipping status (admin only)

## Order Management

### Creating an Order (Customer)

Customers can create orders by sending an array of items:

```json
{
  "items": [
    {
      "productName": "iPhone 13",
      "productId": "60d5f60f1c4d4c001f5e4567",
      "ownerId": "60d5f60f1c4d4c001f5e4568",
      "quantity": 2,
      "totalCost": 1998.0,
      "shippingStatus": "pending"
    }
  ]
}
```

### Order Status Values

- **Order Status**: `pending`, `processing`, `completed`, `cancelled`
- **Shipping Status**: `pending`, `shipped`, `delivered`

### Admin Order Management

Admins can:

- View all orders
- View individual order details
- Update overall order status
- Update individual item shipping status

### Getting Item IDs for Updates

To update an item's shipping status, you need both the `orderId` and `itemId`:

1. Get the order: `GET /orders/:orderId`
2. Find the item in the response's `items` array
3. Use the item's `_id` field as the `itemId`
4. Update shipping status: `PATCH /orders/:orderId/items/:itemId/shipping-status`

**Note**: Don't confuse `itemId` (item's `_id`) with `productId` (product's `_id`)

## Usage

Make sure MongoDB is running on your system, then:

```bash
npm run dev
```

## Hosted API On Render

[Visit Hosted API](https://ecommerce-api-yq6y.onrender.com/)

## Hosted Postman Documentation

[Visit API Documentation](https://documenter.getpostman.com/view/45518060/2sB34kEJfR)
