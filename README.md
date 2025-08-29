# E-commerce API

A RESTful API for an e-commerce application built with Node.js, Express, and MongoDB with real-time notifications using Socket.io.

## Features

- User authentication (register/login)
- User profile management
- Role-based access control (admin/customer)
- Product management (CRUD operations)
- Brands management (CRUD operations)
- Order management system
- Order history for customers and admins
- **Real-time shipping status notifications via Socket.io**
- JWT token authentication
- MongoDB Atlas database integration

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables
4. Start the server: `npm run dev`

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "mongoose-paginate-v2": "^1.7.4",
  "socket.io": "^4.7.2"
}
```

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
- **GET `/auth/profile`** - Get user profile (customers and admins)

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
- **GET `/orders/order-history`** - Get order history (customers see their orders, admins see all)
- GET `/orders/:id` - Get a specific order (admin only)
- PATCH `/orders/:id/status` - Update order status (admin only)
- PATCH `/orders/:orderId/items/:itemId/shipping-status` - Update item shipping status (admin only) **[Triggers Socket.io notification]**

## Real-time Notifications with Socket.io

### Features

- **Real-time shipping status updates** sent to customers
- **JWT-based authentication** for Socket.io connections
- **Room-based notifications** for targeted messaging

### Socket.io Connection

**Client-side connection:**

```javascript
const socket = io("https://ecommerce-api-yq6y.onrender.com", {
  auth: {
    token: "your-jwt-token-here",
  },
});

// Listen for shipping status updates
socket.on("shipping_status_update", (notification) => {
  console.log("Notification:", notification);
  // {
  //   title: "New shipping status",
  //   message: "Your last order shipping status has been updated to shipped"
  // }
});
```

### Notification Format

When an admin updates a shipping status, customers receive:

```json
{
  "title": "New shipping status",
  "message": "Your last order shipping status has been updated to <updated-shipping-status>"
}
```

### Testing Socket.io

Use the provided HTML Socket.io tester:

1. Save the HTML tester file (provided in documentation)
2. Open in browser
3. Connect with customer JWT token
4. Use Postman to update shipping status as admin
5. Watch real-time notifications appear

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
- **Update individual item shipping status (triggers real-time notifications)**

### Customer Order History

Customers can:

- View their own order history via `GET /orders/order-history`
- Receive real-time notifications when shipping status changes
- Access their profile information

### Getting Item IDs for Updates

To update an item's shipping status, you need both the `orderId` and `itemId`:

1. Get the order: `GET /orders/:orderId`
2. Find the item in the response's `items` array
3. Use the item's `_id` field as the `itemId`
4. Update shipping status: `PATCH /orders/:orderId/items/:itemId/shipping-status`

**Note**: Don't confuse `itemId` (item's `_id`) with `productId` (product's `_id`)

## User Profiles

Both customers and admins can access their profile information:

**GET `/auth/profile`** returns:

```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Usage

Make sure MongoDB is running on your system, then:

```bash
npm run dev
```

## Architecture

- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time notifications
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Hosted API On Render

[Visit Hosted API](https://ecommerce-api-yq6y.onrender.com/)

## Hosted Postman Documentation

[Visit API Documentation](https://documenter.getpostman.com/view/45518060/2sB34kEJfR)

## Socket.io Testing

The API includes WebSocket support for real-time notifications. When admins update shipping status, customers connected via Socket.io receive instant notifications. Use the provided HTML tester or integrate Socket.io client in your frontend application.

## Recent Updates

- ✅ Added user profile endpoint
- ✅ Added order history endpoint with role-based filtering
- ✅ Integrated Socket.io for real-time shipping notifications
- ✅ JWT-authenticated Socket.io connections
- ✅ Room-based notification system
