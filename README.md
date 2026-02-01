# Restaurant Admin Dashboard - Eatoes Intern Assessment

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing restaurant menu items, tracking orders, and viewing analytics.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **RESTful API Design**: Clean, organized API endpoints
- **MongoDB Integration**: Mongoose schemas with proper indexing
- **Menu Management**: Full CRUD operations for menu items
- **Order Management**: Create, read, update order status with pagination
- **Search & Filtering**: Text-based search with category and availability filters
- **Analytics**: MongoDB aggregation for top-selling items
- **Validation**: Input validation using Joi
- **Error Handling**: Comprehensive error handling

### Frontend (React 18)
- **Modern React**: Functional components with hooks
- **Custom Hooks**: `useDebounce` for search optimization, `useFetch` for data fetching
- **Responsive Design**: Tailwind CSS for mobile-first UI
- **Optimistic UI Updates**: Instant feedback with rollback on errors
- **Search with Debouncing**: 300ms delay to minimize API calls
- **Toast Notifications**: User-friendly feedback system
- **Pagination**: Efficient order listing
- **Real-time Status Updates**: Update order status dynamically

## 📋 Technical Requirements Completed

### ✅ Database Schema Design
- MenuItem collection with all required fields
- Order collection with auto-generated order numbers
- Text indexing for efficient search
- Timestamps for audit trails

### ✅ Backend API Endpoints

#### Menu APIs
- `GET /api/menu` - Get all menu items with filters
- `GET /api/menu/search?q=query` - Search by name/ingredients
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (with validation)
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `PATCH /api/menu/:id/availability` - Toggle availability

#### Order APIs
- `GET /api/orders` - Get all orders (with pagination & filtering)
- `GET /api/orders/:id` - Get single order with populated items
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

#### Analytics APIs
- `GET /api/analytics/top-sellers` - Get top 5 selling items (MongoDB aggregation)

### ✅ Frontend Features
- Dashboard with statistics and top sellers
- Menu Management page with search and filters
- Orders page with status management and pagination
- Responsive grid layouts
- Loading states and error handling

### ✅ Technical Challenges

1. **Search with Debouncing** ✅
   - Custom `useDebounce` hook
   - 300ms delay implementation
   - Loading indicators
   - Edge case handling

2. **MongoDB Aggregation** ✅
   - Complex pipeline for top sellers
   - Uses $unwind, $group, $lookup, $sort, $limit
   - Calculates total quantity and revenue

3. **Optimistic UI Updates** ✅
   - Immediate UI feedback
   - Background API calls
   - Rollback on error with toast notifications

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Validation | Joi |
| Deployment | Netlify (Frontend), Render (Backend) |

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

4. Run the server:
```bash
npm run dev
```

5. Seed the database (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
restaurant-admin-dashboard/
├── server/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── MenuItem.js           # Menu item schema
│   │   └── Order.js              # Order schema
│   ├── controllers/
│   │   ├── menuController.js     # Menu business logic
│   │   └── orderController.js    # Order business logic
│   ├── routes/
│   │   ├── menuRoutes.js         # Menu API routes
│   │   ├── orderRoutes.js        # Order API routes
│   │   └── analyticsRoutes.js    # Analytics routes
│   ├── scripts/
│   │   └── seed.js               # Database seeding script
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Entry point
│
└── client/
    ├── public/
    │   ├── index.html
    │   └── _redirects            # Netlify SPA routing
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MenuCard.jsx
    │   │   ├── MenuForm.jsx
    │   │   ├── OrderRow.jsx
    │   │   └── Toast.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── MenuManagement.jsx
    │   │   └── Orders.jsx
    │   ├── hooks/
    │   │   ├── useDebounce.js
    │   │   └── useFetch.js
    │   ├── utils/
    │   │   └── api.js            # API utility functions
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Deployment Guide

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier)
3. Whitelist all IPs: `0.0.0.0/0`
4. Create database user with read/write permissions
5. Get connection string and update `.env`

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add `MONGODB_URI`, `PORT`, `NODE_ENV`
5. Deploy and note your backend URL

### Frontend Deployment (Netlify)

1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy

## 🎯 API Documentation

### Menu Endpoints

#### Get All Menu Items
```http
GET /api/menu?category=Appetizer&availability=true&minPrice=5&maxPrice=20
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### Search Menu Items
```http
GET /api/menu/search?q=chicken
```

#### Create Menu Item
```http
POST /api/menu
Content-Type: application/json

{
  "name": "Caesar Salad",
  "description": "Fresh romaine lettuce",
  "category": "Appetizer",
  "price": 8.99,
  "ingredients": ["lettuce", "parmesan", "croutons"],
  "preparationTime": 10,
  "isAvailable": true,
  "imageUrl": "https://..."
}
```

#### Toggle Availability
```http
PATCH /api/menu/:id/availability
```

### Order Endpoints

#### Get Orders with Pagination
```http
GET /api/orders?status=Pending&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [...]
}
```

#### Update Order Status
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "Preparing"
}
```

### Analytics Endpoints

#### Get Top Sellers
```http
GET /api/analytics/top-sellers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Chicken Parmesan",
      "category": "Main Course",
      "totalQuantity": 45,
      "totalRevenue": 854.55
    }
  ]
}
```

## 🎨 Features Showcase

### 1. Search with Debouncing
- Type in the search box
- API call triggers only after 300ms of no typing
- Shows loading indicator while searching
- Handles empty searches and special characters

### 2. Optimistic UI
- Click toggle availability button
- UI updates immediately
- If API fails, changes revert with error notification
- Smooth user experience

### 3. Top Sellers Analytics
- MongoDB aggregation pipeline
- Shows top 5 items by quantity sold
- Displays total revenue per item
- Real-time data from orders collection

## 🧪 Testing

### Manual Testing Checklist

**Menu Management:**
- ✅ Create new menu item
- ✅ Edit existing menu item
- ✅ Delete menu item
- ✅ Toggle availability
- ✅ Search by name/ingredients
- ✅ Filter by category
- ✅ Filter by availability

**Orders:**
- ✅ View all orders
- ✅ Filter by status
- ✅ Update order status
- ✅ Pagination navigation
- ✅ View order details

**Dashboard:**
- ✅ View statistics
- ✅ View top sellers
- ✅ Navigate to other pages

## 🐛 Known Issues & Solutions

### CORS Errors
**Solution**: Ensure CORS is enabled in `server.js`:
```javascript
app.use(cors());
```

### Images Not Loading
**Solution**: Provide valid image URLs or use placeholder images

### MongoDB Connection Issues
**Solution**: Check whitelist IPs in MongoDB Atlas and verify connection string

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 📝 Challenges Faced & Solutions

1. **Challenge**: Implementing debounced search without excessive re-renders
   - **Solution**: Created custom `useDebounce` hook using `setTimeout` and cleanup

2. **Challenge**: Optimistic UI updates with rollback
   - **Solution**: Stored previous state before update, used try-catch for rollback

3. **Challenge**: MongoDB aggregation for top sellers
   - **Solution**: Used `$unwind`, `$group`, `$lookup` pipeline stages

4. **Challenge**: Responsive design across devices
   - **Solution**: Tailwind CSS utility classes with mobile-first approach

## 🎓 Learning Outcomes

- RESTful API design patterns
- MongoDB schema design and indexing
- React custom hooks and state management
- Performance optimization techniques
- Error handling and user feedback
- Full-stack deployment process

## 👤 Author

Created for Eatoes Intern Technical Assessment

## 📄 License

This project is created for assessment purposes.

---

**Live URLs:**
- Frontend: [To be deployed on Netlify]
- Backend API: [To be deployed on Render]

**Note**: Follow the deployment guide above to get your live URLs!
