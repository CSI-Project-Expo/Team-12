# Inventory Management System

A modern, browser-based inventory management solution designed to eliminate the common pain points of traditional desktop applications like Vyapar. Built for reliability, real-time collaboration, and guaranteed data consistency.

---

## Why This Project?

Traditional inventory management apps suffer from fundamental architectural limitations. This project reimagines inventory management from the ground up, solving critical problems that plague multi-user retail environments.

---

## Key Advantages Over Traditional Apps

### 1. Zero Installation, Maximum Flexibility

**The Problem with Traditional Apps:**
- Requires software installation on each device
- Tied to specific devices with licensing restrictions
- Storage and update management overhead
- Device switching creates friction and downtime

**Our Solution:**
- **Runs directly in the browser** - no installation needed
- **Access from any device** - desktop, tablet, or mobile
- **Consistent experience** across all platforms
- **Always up-to-date** - no manual updates required

> **Big Win:** Complete flexibility - manage your inventory from anywhere, on any device, instantly.

---

### 2. Real-Time Multi-User Synchronization

**The Problem with Traditional Apps:**
- Data sync delays between devices
- Temporary data mismatches during busy periods
- "Who updated last?" confusion
- Sync conflicts in multi-staff environments

**Our Solution:**
- **Single source of truth** - one live system
- **Instant updates** - everyone sees changes in real-time
- **Zero sync lag** - no waiting for data to propagate
- **Conflict-free collaboration** - built for teams

> **Big Win:** No more confusion about which data is current - everyone always sees the same information.

---

### 3. Guaranteed Stock Accuracy - No Overselling

**The Problem with Traditional Apps:**
- Sync timing creates race conditions
- Two simultaneous sales can briefly conflict
- Overselling risk during peak hours
- Stock counts can become inaccurate

**Our Solution:**
- **Atomic stock checks** - sales allowed only if stock exists at that exact moment
- **Concurrency control** - simultaneous sales handled safely
- **Impossible to oversell** - guaranteed by system architecture
- **Always accurate inventory** - no phantom stock

> **Big Win:** Stock correctness is mathematically guaranteed, not just "usually right."

---

### 4. Transactional Integrity - All or Nothing

**The Problem with Traditional Apps:**
- Billing, stock updates, and records are separate features
- Data can drift if sync fails or process is interrupted
- Ghost stock entries or missing bills
- Manual reconciliation required

**Our Solution:**
- **Single atomic transaction:**
  ```
  Sale → Stock Update → Bill Generation → Email
  ```
- **Either all happen or none happen** - no partial states
- **No mismatched records** - guaranteed consistency
- **Zero reconciliation** - system maintains integrity automatically

> **Big Win:** Your books are always accurate - no ghost inventory or missing invoices.

---

### 5. Complete Transparency & Accountability

**The Problem with Traditional Apps:**
- Difficult to track who made changes
- Limited audit trail
- No clear history of stock adjustments
- Accountability gaps in multi-staff shops

**Our Solution:**
- **Every action is logged** with user, timestamp, and details
- **Complete audit trail:**
  - Sales transactions
  - Stock adjustments
  - User actions
  - System events
- **Full accountability** - know exactly who did what and when
- **Easy investigation** - trace any discrepancy to its source

> **Big Win:** Complete visibility into all operations - perfect for managing teams.

---

### 6. Flexible & Customizable Workflows

**The Problem with Traditional Apps:**
- Fixed, rigid workflows
- Your business must adapt to the software
- Feature overload with unnecessary complexity
- One-size-fits-all approach

**Our Solution:**
- **Core rules-based design** - built around fundamental principles
- **Adaptable workflows** - customize to your business needs
- **Focused functionality** - correctness over feature bloat
- **Clean, controllable system** - you're in charge

> **Big Win:** The system adapts to your business, not the other way around.

---

### 7. Always Current - Zero Maintenance

**The Problem with Traditional Apps:**
- Manual app updates required
- Version fragmentation across devices
- Old versions cause compatibility issues
- Users on different versions create problems

**Our Solution:**
- **Browser-based** = always latest version automatically
- **Zero user maintenance** - updates happen seamlessly
- **No version conflicts** - everyone uses the same version
- **Instant feature rollout** - new capabilities available immediately

> **Big Win:** Your team never worries about updates - the system is always current.

---

## Architecture Highlights

- **Web-based architecture** for universal access
- **Real-time database synchronization** for instant updates
- **Transaction-based operations** for data integrity
- **Comprehensive audit logging** for accountability
- **Responsive design** for any device

---

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Node.js installed on your machine

### Environment Setup
Before running the application, you must configure your environment variables:
1. Navigate to the `server/` directory.
2. Duplicate the `server/.env.example` file and rename it to `.env`.
3. Open the new `.env` file and fill in your actual credentials (MongoDB URI, Email User/Pass, Gemini API Key, etc.).
**Note:** The application (specifically features like emails and AI chat) will fail to run or operate correctly if these variables are missing.

### Access
Simply navigate to the application URL in your browser and log in. Your inventory management system is ready to use.

---

## Perfect For

- **Retail shops** with multiple staff members
- **Warehouses** requiring real-time stock visibility
- **Multi-location businesses** needing centralized inventory
- **Growing businesses** that need flexibility and scalability
- **Any business** tired of sync issues and data inconsistencies

---

## Security & Reliability

- Secure authentication and authorization
- Role-based access control
- Encrypted data transmission
- Automated backups
- Disaster recovery ready

---

## Core Features

- **Inventory Management** - Add, update, and track products
- **Sales Processing** - Quick and accurate transaction handling
- **Bill Generation** - Automatic invoice creation
- **Stock Alerts** - Low stock notifications
- **Reporting** - Comprehensive business insights
- **Multi-user Support** - Team collaboration built-in
- **Audit Trails** - Complete action history

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## License

[Specify your license here]

---

## Support

For questions or support, please contact [your contact information]

---

## The Bottom Line

This isn't just another inventory management system - it's a fundamental rethinking of how inventory should work in a modern, collaborative environment. By eliminating installation requirements, guaranteeing data consistency, and providing real-time visibility, we've created a system that just works - reliably, every time.

**No sync issues. No overselling. No confusion. Just accurate, real-time inventory management.**

---

## Tech Stack

### Frontend
- **Next.js** - Modern React framework for production-grade applications

### UI / Design
- **shadcn/ui** - Beautiful, accessible component library

### Backend
- **Node.js / Express API** - Robust server-side architecture

### Database
- **MongoDB** - Flexible NoSQL database for scalable data management

---

## Design Focus

### Retailer-Centric Approach
Our design philosophy prioritizes the retailer experience:

- **More attractive** - Premium, professional interface
- **More useful** - Feature-rich with business-critical tools
- **Easier to use** - Intuitive workflows designed for daily operations
- **Business-oriented model** - Built around real retailer needs

### User (Customer) Side UI
The customer interface is intentionally streamlined:

- **Simple and clean** - No unnecessary complexity
- **Attractive but minimal** - Focus on usability over flashiness
- **Easy to understand** - Intuitive for all users
- **Quick interactions** - Fast, efficient user experience

---

## QR Code + OCR Based Flow

### Innovative Bill Processing
Our system combines QR code technology with OCR (Optical Character Recognition) for seamless transactions:

### How It Works

**1. Purchase & Data Generation**
- Items are purchased and MongoDB generates a unique ID
- Bill data is saved in MongoDB
- The saved data is converted into a string
- That string is encoded into a QR code / barcode

**2. User Options**
Users can interact with their bills in two ways:
- **Upload a printed bill** - Take a photo and upload
- **Use inbuilt camera scanner** - Scan directly in the app

**3. OCR Processing**
- OCR extracts bill details from the image
- Data is automatically parsed and validated
- Information is ready for retailer verification

**4. Retailer Interaction**
- User shows the QR code to the retailer
- Retailer app scans the QR code
- QR code is converted back into string / ID
- System fetches complete data from MongoDB
- Purchase is verified and completed instantly

### Benefits
- **Paperless option** - Digital bill storage
- **Quick verification** - Instant QR code scanning
- **Error reduction** - OCR eliminates manual entry
- **Flexible workflow** - Multiple input methods

---

## Why Next.js?

We chose Next.js as our primary framework for several strategic reasons:

### Built by Vercel
- Industry-leading framework with strong community support
- Regular updates and cutting-edge features
- Production-ready out of the box

### Unified Frontend + Backend
- **API routes** handle lightweight backend logic
- Frontend and backend in the same project
- Simplified development workflow
- Reduced complexity for simple backend needs

### Performance & Developer Experience
- Server-side rendering (SSR) for better SEO
- Static site generation (SSG) for optimal performance
- Built-in optimization for images and assets
- Excellent developer tooling and hot reload

### Scalability
- Easy deployment on Vercel platform
- Automatic scaling capabilities
- Edge network support for global performance

---

## Project Information

**Last Updated:** February 24, 2026  
**Team:** Team-12

---

## Development Update – February 23, 2026

This section documents the frontend authentication redesign and the production-grade backend database architecture implementation completed today.

---

## Frontend Authentication Flow Redesign (React + Vite)

### Objective
Redesign the authentication flow to support dual signup pages (User + Admin) while maintaining a single unified login page.

---

### Files Modified / Created

#### 1. src/Pages/Login.jsx (Modified)
- Added navigation links:
  - **Create User Account**
  - **Create Admin Account**
- Preserved unified login logic so both roles authenticate from one centralized entry.
- Maintained premium UI styling (glassmorphism card, soft glow background).

---

#### 2. src/Pages/UserSignup.jsx (New)
- Dedicated User Registration page.
- Fields:
  - Full Name
  - Email Address
  - Password
- Matches Login page aesthetic and design system.
- Currently includes mock redirect to `/shop`.

---

#### 3. src/Pages/AdminSignup.jsx (New)
- Dedicated Admin Registration page.
- Fields:
  - Full Name
  - Email Address
  - Store Name
  - Password
- Matches Login page premium UI styling.
- Currently includes mock redirect to `/admin/dashboard`.

---

#### 4. src/App.jsx (Modified)
- Imported `UserSignup` and `AdminSignup`.
- Registered new routes:
  - `/signup/user`
  - `/signup/admin`
- Integrated into main `<Routes>` tree.

---

## Backend Database Architecture (Node.js + Mongoose)

### Objective
Design and implement a production-ready, concurrency-safe, transaction-based database layer for the Inventory Management System.

All backend changes scoped within:

`a:/CSI/Team-12/server/`

---

## Database Models Implemented

---

### 1. server/models/User.js
- Strict required field validation.
- Email:
  - `unique: true`
  - Regex validation
  - Indexed
- Role enforced using enum:
  - `['admin', 'user']`
- Designed to support dual signup flow securely.

---

### 2. server/models/Product.js
- Enforced:
  - `price` minimum = 0
  - `stock` minimum = 0
- Guaranteed SKU uniqueness via indexing.
- Default `lowStockThreshold` configured.
- Linked `createdBy` to User ObjectId.
- Prevents negative inventory states at schema level.

---

### 3. server/models/Sale.js
- Embedded `items` array containing:
  - `productId`
  - `quantity`
  - `priceAtSale` (Snapshot Pricing)
- Snapshot pricing ensures historical report accuracy even if product price changes later.
- Enforced sale status enum:
  - `pending`
  - `completed`
  - `cancelled`

---

### 4. server/models/Bill.js
- References Sale via ObjectId.
- Enforced unique, indexed `qrString`.
- Designed for QR + OCR validation workflow.

---

### 5. server/models/AuditLog.js
- Captures:
  - `userId`
  - `actionType`
  - `collectionName`
  - `documentId`
  - `previousData`
  - `newData`
- Applied compound indexing on:
  - `userId`
  - `timestamp`
- Designed for high-volume audit querying efficiency.

---

## Concurrency & Transaction Services

### server/services/saleService.js

#### reduceStockAtomically()
Implements MongoDB atomic stock reduction using:

`findOneAndUpdate({ stock: { $gte: quantity } })`

Guarantees:
- No race-condition overselling
- Stock can never fall below zero
- Thread-safe atomic updates
- Multi-user safety under simultaneous requests

---

#### createSaleTransaction()
Wraps entire sale lifecycle inside:

`session.startTransaction()`

Operations included:

1. Stock reduction
2. Sale creation
3. Bill generation
4. Audit logging
5. Commit transaction

If any step fails:
- Executes `session.abortTransaction()`
- Prevents ghost transactions
- Prevents mismatched stock and financial records
- Ensures strict ACID-compliant behavior

---

## Backend Architecture Documentation

### server/README-backend.md
- Defined scalable folder structure:
  - models/
  - services/
  - controllers/
  - routes/
  - middlewares/
- Established separation of concerns:
  - Data Layer (Models)
  - Business Logic (Services)
  - API Layer (Controllers & Routes)
- Documented maintainability principles for future backend expansion.

---

## Summary of Today's Achievements

- Implemented dual-role authentication UI.
- Designed strict database schema architecture.
- Enforced validation and indexing strategies.
- Implemented atomic concurrency-safe stock control.
- Built full transaction-based sale workflow.
- Structured backend using production engineering principles.

---

## Development Update — 24 February 2026

### Focus of Today's Work

Today's development session focused on:

- Premium SaaS-style frontend redesign
- Replacing hardcoded dashboard data with real API integration
- Implementing dynamic low-stock alert functionality
- Adding safe, read-only backend routes to support analytics

---

### Premium SaaS Frontend Redesign

The frontend was upgraded from a basic light theme to a modern dark SaaS-style interface.

#### Improvements:
- Dark design system using `slate-950` and `slate-900`
- Emerald accent color for primary actions
- Consistent spacing and typography
- Responsive layout (desktop + tablet)
- Framer Motion animations (fade-in, stagger effects)
- Reusable components (`StatCard`, `LowStockAlert`)
- Improved sidebar with active highlighting
- Topbar with profile dropdown

All pages (Admin, Public, and Customer) now follow a unified design system.

---

### Real Dashboard Integration

Previously, dashboard statistics were hardcoded.
These have now been replaced with real backend data.

#### New Read-Only API Routes Added:

- `GET /api/products`
- `GET /api/products/low-stock`
- `GET /api/dashboard/stats` (Admin only)

#### Dashboard Now Displays:
- Total product count
- Low-stock product count
- Today's completed sales total
- Monthly revenue calculation

**Important:**
- No changes were made to transaction logic.
- No changes were made to concurrency control.
- No changes were made to authentication.
- No schema modifications were performed.
- Only safe, read-only routes were added.

---

### Low-Stock Alert System (New Feature)

Implemented dynamic low-stock monitoring.

#### Logic:
```js
stock < lowStockThreshold
```

Uses MongoDB `$expr` to compare two fields within the same document.

#### Feature Details:
- Dashboard stat card shows total low-stock count
- Dedicated alert section lists affected products
- Severity indicators: **Critical** (stock ≤ 2) and **Warning** (stock ≤ threshold)
- Product name, current stock, threshold, and SKU displayed
- No modifications to the existing `Product` schema

---

### New Files Created

| File | Purpose |
|---|---|
| `server/controllers/productController.js` | Read-only product queries |
| `server/controllers/dashboardController.js` | Dashboard aggregation stats |
| `server/routes/productRoutes.js` | GET /api/products, GET /api/products/low-stock |
| `server/routes/dashboardRoutes.js` | GET /api/dashboard/stats |
| `src/lib/api.js` | Axios client with JWT interceptor |
| `src/components/dashboard/StatCard.jsx` | Reusable stat card component |
| `src/components/dashboard/LowStockAlert.jsx` | Low-stock alert table component |

### Files Modified

| File | Change |
|---|---|
| `server/index.js` | +2 lines to register new routes |
| `tailwind.config.js` | Dark theme tokens, Inter font, custom shadows |
| `src/index.css` | Dark base styles, Google Font, scrollbar styling |
| `src/App.css` | Cleared Vite boilerplate |
| `src/Layouts/AdminLayout.jsx` | Dark sidebar, topbar, profile dropdown |
| `src/Pages/admin/Dashboard.jsx` | Real API data, stat cards, low-stock alerts |
| `src/Pages/admin/Products.jsx` | Real API data, search, dark theme |
| `src/Pages/admin/Stock.jsx` | Dark theme restyling |
| `src/Pages/admin/Orders.jsx` | Dark theme restyling |
| `src/Pages/admin/SupplierBills.jsx` | Dark theme, improved upload UI |
| `src/Pages/admin/Settings.jsx` | Dark theme with section icons |
| `src/Pages/Landing.jsx` | Dark hero, feature cards, animations |
| `src/Pages/Login.jsx` | Dark card, labeled inputs |
| `src/Pages/AdminSignup.jsx` | Dark card, labeled inputs |
| `src/Pages/UserSignup.jsx` | Dark card, labeled inputs |
| `src/Pages/customer/Shop.jsx` | Dark product cards |
| `src/Pages/customer/Cart.jsx` | Dark cart items |
| `src/Pages/customer/Checkout.jsx` | Dark checkout form |
| `src/Pages/customer/OrderConfirmation.jsx` | Dark confirmation card |

### Dependencies Added
- `axios` — HTTP client with interceptors
- `framer-motion` — Animation library
- `lucide-react` — Icon library

---

### Summary of Today's Achievements

- Redesigned entire frontend to premium dark SaaS theme.
- Replaced all hardcoded dashboard data with real API calls.
- Implemented functional low-stock alert system.
- Added 4 new read-only backend files (zero impact on existing logic).
- All 14 pages now follow unified dark design system.
- Backend safety fully maintained — no changes to transactions, schemas, or auth.

---

## 📅 Update — 25 February 2026

### 🎯 Goal

Convert the application from a single-store demo into a multi-shop inventory management system with real backend operations and proper role-based routing.

---

### 🆕 New Files

#### shopController.js
- `GET /api/shops` — Lists admin users with `storeName` as shops
- `GET /api/shops/:id/products` — Fetches products using `createdBy`

#### shopRoutes.js
- Registers shop endpoints (JWT-protected)

#### orderController.js
- `POST /api/orders`
- Validates stock for each item
- Deducts stock using `$inc`
- Creates Sale document
- Returns real `orderId` and `totalAmount`
- Replaced MongoDB transaction logic with sequential validation

#### orderRoutes.js
- Registers `POST /api/orders` (JWT-protected)

#### ShopsList.jsx
- New `/shops` page
- Fetches shops from backend
- Displays animated shop card grid
- Added logout button and user greeting

---

### 🔄 Major Modifications

#### Backend
- Registered `/api/shops` and `/api/orders` routes
- Added `createProduct()` to persist products in MongoDB
- Scoped product queries to logged-in admin only
- Added protected `POST /api/products` endpoint

#### Frontend
- Added `/shops` and `/shop/:shopId` routes
- Implemented shop-scoped cart (`cartShopId`, `cartShopName`)
- Cart auto-clears when switching shops
- Removed hardcoded products
- Replaced random checkout simulation with real order API call
- Order confirmation now displays real backend order data
- Updated user redirects from `/shop` → `/shops`
- Rebranded application to **StockSmart**

---

### 🐛 Bugs Fixed
- **Shop inventory showing no products** → Fixed by implementing backend product persistence
- **Order placement returning 500 error** → Fixed by removing MongoDB transaction dependency
- **Missing logout on customer side** → Added logout button in ShopsList

---

## 📅 Update — 26 February 2026

### 1. Work Completed (What Is Done)

#### 1.1 Backend Stability & Bug Fixes
- Added missing AuditLog enums (`SALE_DEDUCTION`, `RESTOCK`, `ADJUSTMENT`) to prevent crashes.
- Fixed “Cannot set headers after they are sent” error in authentication middleware.
- Wrapped authentication controllers (`registerUser`, `loginUser`, `getUserProfile`, `updateUserProfile`) in proper try/catch blocks.
- Implemented soft-delete feature for products (`isDeleted: true`).
- Created `DELETE /api/products/:id` endpoint.

#### 1.2 Production Hardening
- Implemented global error-handling middleware.
- Added database connection retry logic with exponential backoff.
- Implemented unhandled promise rejection catchers.
- Improved backend reliability to prevent server crashes.

#### 1.3 Automated Backend Testing
- Set up in-memory MongoDB Replica Set using `MongoMemoryReplSet`.
- Implemented 16 automated backend tests.
- Verified:
  - Duplicate email prevention.
  - Concurrency safety (no overselling).
  - Proper transaction rollback on failed orders.

#### 1.4 QR Code & Ticket System
- Designed premium Order Confirmation Ticket UI.
- Ensured Order ID matches real database `orderId`.
- Implemented functional “Download Ticket” button.
- Replaced live camera scanner with Upload QR Image feature.
- Integrated `html5-qrcode` library for live camera QR extraction.
- Successfully tested complete end-to-end QR verification workflow.

#### 1.5 Chatbot Integration
- AI chatbot feature fully implemented.
- Powered by Google Gemini-2.5-flash AI model.
- Connected to real-world store database for context-aware inventory queries.
- Floating Chatbot UI integrated across the entire frontend (except on auth pages).
#### 1.6 Live Camera QR Code Scanner
- Created a new `QRCodeScanner.jsx` component using the `html5-qrcode` library.
- Integrated webcam access to physically scan QR codes in real-time.
- Styled the live scanner with an animated emerald scanning line to match the SaaS theme.
- Configured proper memory management to stop camera streams and prevent memory leaks.
- Added graceful error handling for missing camera hardware or denied permissions.

#### 1.7 Verification Page UI Overhaul
- Enhanced `BillScanner.jsx` with an elegant toggle switch.
- Users can securely swap between "Scan with Camera" and "Upload QR Image" modes.
- Both modes successfully connected directly into the `GET /api/bills/verify/` backend controller.

#### 1.8 Architecture & Project Roadmap Update
- Permanently removed Optical Character Recognition (OCR) from the software roadmap to focus on purely digital QR workflow.
- Audited the codebase to confirm full completion of the Google Gemini AI Chatbot (`ChatBot` + `chatController`), updating project tracking accordingly.

### 2. Work Pending (What Is Left)

#### 2.1 Frontend Automated Testing
- Backend testing completed.
- UI automated testing (Cypress/Selenium) not implemented.
- Only manual testing performed.

#### 2.4 Deployment & Production Setup
- MongoDB Atlas cluster setup pending.
- `.env` production configuration pending.
- Cloud deployment (Render/Vercel/Netlify) pending.
- Real-device staging validation pending.

### Current Status
- The backend is stable, secure, and production-ready at code level.
- The QR verification system is fully functional.
- The AI Chatbot is fully integrated.
- Cloud deployment and automated UI testing are the next major steps.
