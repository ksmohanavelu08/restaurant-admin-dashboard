# Quick Start Guide - Restaurant Admin Dashboard

## 🚀 Get Started in 5 Minutes

### Step 1: Set up MongoDB Atlas (2 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster (M0 tier)
3. Click "Connect" → "Drivers" → Copy your connection string
4. Replace `<password>` in the connection string with your database password
5. In "Network Access", add IP: `0.0.0.0/0` (allow all - for development only)

### Step 2: Backend Setup (1 minute)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=your_connection_string_here
PORT=5000
NODE_ENV=development" > .env

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

Server will run on `http://localhost:5000`

### Step 3: Frontend Setup (1 minute)

```bash
# Open a new terminal
# Navigate to client folder
cd client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the app
npm start
```

App will open at `http://localhost:3000`

## ✅ Verify Everything Works

1. Open `http://localhost:3000`
2. You should see the Dashboard with statistics
3. Click "Menu Management" - you should see 15 sample menu items
4. Try searching for "chicken"
5. Click "Orders" - you should see 10 sample orders
6. Try changing an order status

## 🎯 Test the Technical Challenges

### 1. Test Debounced Search
- Go to Menu Management
- Type slowly in the search box
- Notice: No API calls until you stop typing for 300ms
- Check browser console to see the delay

### 2. Test Optimistic UI
- Click the "Available/Unavailable" button on any menu item
- Notice: UI updates immediately
- If you want to test rollback, temporarily stop the backend server and toggle availability

### 3. Test Top Sellers
- Dashboard shows "Top 5 Selling Items" based on order data
- This uses MongoDB aggregation pipeline

## 📊 Sample Data Included

After running `npm run seed`, you'll have:
- **15 Menu Items** across all categories
- **10 Sample Orders** with various statuses
- All properly linked with relationships

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Ensure you've whitelisted `0.0.0.0/0` in Network Access
- Verify your database password is correct

### "CORS Error"
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in client `.env`

### Port already in use
```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)

# Or use different port in .env
PORT=5001
```

## 🎨 What to Try

1. **Create a New Menu Item**
   - Click "Add Menu Item"
   - Fill in the form
   - See it appear immediately

2. **Search & Filter**
   - Search for "dessert"
   - Filter by category
   - Try price range filters

3. **Manage Orders**
   - Change order status
   - Filter by status
   - Navigate through pages

4. **View Analytics**
   - Check dashboard statistics
   - See which items sell best

## 🚀 Next Steps

Once everything works locally:

1. **Deploy Backend to Render**
   - Push code to GitHub
   - Connect to Render
   - Add environment variables
   - Deploy!

2. **Deploy Frontend to Netlify**
   - Connect to Netlify
   - Set build command: `npm run build`
   - Add environment variable with your Render URL
   - Deploy!

## 📚 Key Files to Understand

**Backend:**
- `server/models/MenuItem.js` - Database schema
- `server/controllers/menuController.js` - Business logic
- `server/routes/menuRoutes.js` - API endpoints

**Frontend:**
- `client/src/hooks/useDebounce.js` - Debounce implementation
- `client/src/pages/MenuManagement.jsx` - Menu page with search
- `client/src/components/MenuCard.jsx` - Optimistic UI example

## 💡 Pro Tips

- Open browser DevTools → Network tab to see API calls
- Use MongoDB Compass to view your database
- Check server terminal for API request logs
- Use React DevTools to inspect component state

## 🎉 You're Ready!

The app is now fully functional locally. All technical requirements are implemented:
✅ MERN Stack
✅ RESTful APIs
✅ MongoDB Aggregation
✅ Debounced Search
✅ Optimistic UI
✅ Pagination
✅ Validation

Happy coding! 🚀
