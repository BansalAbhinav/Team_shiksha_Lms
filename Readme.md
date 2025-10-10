# 📚 Team Shiksha LMS 🎓

This is a full-stack Library Management System designed to streamline the management of educational resources. It provides a comprehensive suite of tools for students and administrators to manage books, track issues, handle returns, and monitor library operations efficiently.

## 🌟 Features

**📖 Book Management**: Comprehensive catalog of educational books with detailed information including title, author, category, and availability status.

**👤 User Authentication**: Secure user registration and login system with JWT-based authentication and role-based access control.

**📊 Issue & Return System**: Complete book issuing and returning workflow with automatic due date calculation and fine management.

**🕒 Due Date Tracking**: Automatic tracking of due dates with overdue book identification and late fee calculation.

**📱 Responsive Dashboard**: Intuitive user interface providing real-time statistics about library operations, book availability, and user activity.

**🔍 Advanced Search & Filtering**: Search books by title, author, or category with real-time filtering capabilities.

**📈 Analytics & Reports**: Dashboard analytics showing total books, available books, categories, and user statistics.

**💰 Fine Management**: Automated fine calculation for overdue books with damage assessment capabilities.


---

**🎯 Project Status**: Active Development  
**🌐 Live Application**: [Team Shiksha LMS](https://team-shiksha-lms-2tt7.vercel.app/)  
**🔗 Backend API**: [API Server](https://team-shiksha-lms.onrender.com/)  
**📧 Support**: Contact us through the Contact page in the application

---

## ✨ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES6+ Modules)
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (JSX)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB Atlas account (or local MongoDB)

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/BansalAbhinav/Team_shiksha_Lms.git
cd Team_shiksha_Lms
```

2. **Backend Setup:**
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add the following environment variables
# You can use the .env.example file as a template
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>

# Start the development server
npm run dev

# Or start production server
npm start
```

3. **Frontend Setup:**
```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create a .env file (if needed for API endpoints)
VITE_API_URL=http://localhost:5000/

# Start the development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```
Team_shiksha_Lms/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookController.js     # Book & Issue management
│   │   ├── penaltyController.js  # Fine management
│   │   └── reviewController.js   # Review system
│   ├── models/
│   │   ├── Book.js              # Book schema
│   │   ├── Issue.js             # Book issue schema
│   │   ├── User.js              # User schema
│   │   ├── Penalty.js           # Penalty schema
│   │   └── Review.js            # Review schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── bookRoutes.js        # Book & Issue routes
│   │   ├── penaltyRoutes.js     # Penalty routes
│   │   └── reviewRoutes.js      # Review routes
│   ├── package.json
│   ├── server.js                # Main server file
│   └── vercel.json              # Vercel deployment config
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── apis/
    │   │   ├── authAPI.js       # Authentication API calls
    │   │   ├── bookAPI.js       # Book API calls
    │   │   ├── issueAPI.js      # Issue API calls
    │   │   └── axiosInstance.js # HTTP client configuration
    │   ├── components/
    │   │   ├── Auth/            # Login & Signup components
    │   │   ├── BookCard.jsx     # Book display component
    │   │   ├── BookDetail.jsx   # Book detail view
    │   │   ├── IssueForm.jsx    # Book issuing form
    │   │   ├── ReturnForm.jsx   # Book return form
    │   │   ├── Navbar.jsx       # Navigation component
    │   │   └── ProtectedRoute.jsx # Route protection
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── Books.jsx        # Book catalog
    │   │   ├── MyBooks.jsx      # User's issued books
    │   │   ├── BookDetailPage.jsx # Individual book page
    │   │   └── Contact.jsx      # Contact page
    │   ├── utils/
    │   │   └── sampleData.js    # Sample data for development
    │   ├── App.jsx              # Main App component
    │   ├── main.jsx             # App entry point
    │   └── index.css            # Global styles
    ├── package.json
    ├── vite.config.js           # Vite configuration
    ├── tailwind.config.js       # Tailwind configuration
    ├── postcss.config.js        # PostCSS configuration
    └── vercel.json              # Vercel deployment config
```

## 🔗 API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication 🔐
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)

### Books 📚
- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book (Protected)
- `GET /api/books/:id` - Get a single book by ID
- `PUT /api/books/:id` - Update a book (Protected)
- `DELETE /api/books/:id` - Delete a book (Protected)
- `GET /api/categories` - Get all book categories
- `GET /api/books/category/:category` - Get books by category
- `GET /api/books/:id/availability` - Check book availability

### Issues & Returns 📋
- `POST /api/issues` - Issue a book (Protected)
- `PUT /api/issues/return` - Return a book (Protected)
- `GET /api/issues` - Get all issues (Protected)
- `GET /api/issues/my` - Get current user's issues (Protected)
- `GET /api/issues/:id` - Get issue by ID (Protected)
- `GET /api/issues/overdue` - Get overdue books (Protected)

### Penalties 💰
- `GET /api/penalties` - Get penalties (Protected)
- `POST /api/penalties` - Create penalty (Protected)
- `PUT /api/penalties/:id` - Update penalty (Protected)
- `DELETE /api/penalties/:id` - Delete penalty (Protected)

### Reviews ⭐
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

## 🛠️ Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
```

### Frontend (.env) - Optional
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Team Shiksha LMS
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run get-ip     # Get local IP address for team sharing
npm run team-setup # Setup for team development
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Frontend (Vercel)
### Backend (Render)


## 📱 Features in Detail

### User Management
- **Registration**: New users can create accounts with email verification
- **Login**: Secure authentication with JWT tokens
- **Profile Management**: Users can view and update their profiles

### Book Catalog
- **Comprehensive Search**: Search by title, author, or category
- **Category Filtering**: Filter books by predefined categories
- **Availability Status**: Real-time availability tracking
- **Book Details**: Detailed information including cost, author, and PDF links

### Issue Management
- **Smart Issuing**: Prevents multiple active issues per user
- **Due Date Calculation**: Automatic calculation based on issue type
- **Issue Types**: Support for individual (30 days) and group (180 days) issues
- **Return Processing**: Streamlined return process with condition assessment

### Fine System
- **Automatic Calculation**: Late fees calculated based on overdue days
- **Damage Assessment**: Support for different damage types and costs
- **Payment Tracking**: Track fine payments and outstanding amounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Inspired by modern library management needs
- Built with love for the education community

---

*Built with ❤️ for educational institutions and learning communities*
