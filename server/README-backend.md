# Server Structure Guidelines

Based on your requirement for a production-level MongoDB/Mongoose architecture, here is the recommended folder structure to ensure scalability, security, and maintainability for the `Node.js + Express` backend.

```
server/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection and Mongoose setup
├── controllers/         # Route handlers containing the incoming request logic
│   ├── authController.js
│   ├── productController.js
│   └── saleController.js
├── middlewares/         # Custom Express middlewares
│   ├── authMiddleware.js# JWT verification and role checking (admin/user)
│   ├── errorMiddleware.js# Gloabl error handler
│   └── validateMiddleware.js # For validating requests (e.g. Joi/Zod)
├── models/              # Mongoose Data Models (The Data Layer)
│   ├── AuditLog.js      # System audit trails
│   ├── Bill.js          # QR code and billing info
│   ├── Product.js       # Inventory schema with strict validation
│   ├── Sale.js          # Point of sale transactions, snapshot pricing
│   └── User.js          # Users and Roles
├── routes/              # Express API Routes Definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── saleRoutes.js
├── services/            # Core Business Logic and Database Transactions
│   └── saleService.js   # Transactions, atomic stock reductions
├── utils/               # Helper modules
│   └── logger.js        # Logging (e.g., Winston/Morgan)
├── package.json         # Node dependencies
└── server.js            # Express app entry point
```

### Key Principles

1. **Separation of Concerns:** Keep your Mongoose schemas (`models/`) strict and concerned only with data shape. Put complex business rules and transactions into `services/`.
2. **Fat Models, Thin Controllers:** Use Mongoose features (like custom schema methods or static methods) for data-specific logic. 
3. **Atomic Operations are God:** All inventory reductions MUST use `findOneAndUpdate({ _id, stock: { $gte: quantity } })` or rely on `session.startTransaction()`. Never retrieve a document, modify the property via JS, and `.save()` unless you are guaranteed exclusive access (which you aren't in a multi-user app).
4. **Transactions for Integrity:** Use MongoDB sessions & transactions (`$session`) when a business action modifies multiple collections (e.g., deducting stock, creating a sale record, creating a bill, saving an audit log).
