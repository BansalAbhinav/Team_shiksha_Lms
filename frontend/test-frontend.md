# Frontend Testing Guide

## Issues Fixed

✅ **API Response Handling**: Fixed to handle different response formats from backend
✅ **Sample Data Fallback**: Added sample data when backend is not connected
✅ **Enhanced CSS**: Improved styling with better visual hierarchy
✅ **Debug Information**: Added debug logs and visual indicators
✅ **Error Handling**: Better error handling with fallbacks

## How to Test

### 1. Start the Frontend
```bash
cd frontend
npm run dev
```

### 2. Test with Sample Data (Backend Off)
- Open `http://localhost:5173`
- You should see sample books displayed
- Yellow banner indicates sample data is being used
- All functionality should work with sample data

### 3. Test with Backend Connected
- Start your backend server on `http://localhost:5000`
- Refresh the frontend
- Yellow banner should disappear
- Real data from backend should load

### 4. Test Features
- **Home Page**: Shows stats and recent books
- **Books Page**: Browse, search, and filter books
- **Book Details**: View individual book information
- **Authentication**: Login/Signup forms
- **Admin Panel**: Full admin functionality (requires admin login)

## Debug Information

The frontend now includes:
- Console logs for API responses
- Visual debug panel (in development mode)
- Sample data fallback
- Better error messages

## Common Issues & Solutions

### Issue: Empty UI
**Solution**: Check browser console for API errors. Sample data should load automatically.

### Issue: Books not showing
**Solution**: 
1. Check if backend is running on port 5000
2. Check browser console for errors
3. Verify API endpoints in backend

### Issue: Styling problems
**Solution**: 
1. Ensure Tailwind CSS is properly loaded
2. Check if custom CSS classes are applied
3. Clear browser cache

## API Endpoints Expected

The frontend expects these endpoints:
- `GET /api/books` - Get all books
- `GET /api/categories` - Get categories
- `GET /api/books/:id` - Get book by ID
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

## Sample Data

If backend is not available, the frontend will show:
- 6 sample books with different categories
- Fiction, Non-Fiction, Academic categories
- Different availability statuses
- PDF links for some books

This ensures the UI is always functional for testing and development.
