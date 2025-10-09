# Team Shiksha LMS Frontend

A modern, responsive frontend for the Team Shiksha Library Management System built with React and Tailwind CSS.

## Features

### 🔐 Authentication
- User registration and login
- Role-based access control (Admin/User)
- Protected routes
- JWT token management

### 📚 Book Management
- Browse all books with search and filtering
- View detailed book information
- Category-based filtering (Fiction, Non-Fiction, Academic)
- Book availability tracking
- PDF access for digital books

### 📖 Issue Management
- Issue books with customizable due dates
- Return books with damage assessment
- Track overdue books and fines
- Personal book history

### 👨‍💼 Admin Panel
- Dashboard with system statistics
- Add, edit, and delete books
- Manage all book issues
- View overdue books and fines
- User management capabilities

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean, intuitive interface
- Toast notifications
- Loading states and error handling
- Modern color scheme and typography

## Technology Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **Vite** - Build tool and dev server

## Project Structure

```
frontend/src/
├── apis/                    # API integration layer
│   ├── axiosInstance.js    # Axios configuration
│   ├── authAPI.js          # Authentication APIs
│   ├── bookAPI.js          # Book management APIs
│   └── issueAPI.js         # Issue management APIs
├── components/             # Reusable components
│   ├── Auth/              # Authentication components
│   ├── Admin/             # Admin-specific components
│   ├── BookCard.jsx       # Book display component
│   ├── BookDetail.jsx     # Book details component
│   ├── IssueForm.jsx      # Book issue form
│   ├── ReturnForm.jsx     # Book return form
│   ├── Navbar.jsx         # Navigation component
│   └── ProtectedRoute.jsx # Route protection
├── context/               # React Context
│   └── AuthContext.jsx    # Authentication state
├── pages/                 # Page components
│   ├── Home.jsx           # Landing page
│   ├── Books.jsx          # Book listing page
│   ├── MyBooks.jsx        # User's issued books
│   ├── Admin.jsx          # Admin dashboard
│   ├── BookDetailPage.jsx # Individual book page
│   └── Contact.jsx        # Contact page
├── App.jsx                # Main app component
├── main.jsx              # App entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The frontend communicates with the backend through REST APIs. All API calls are centralized in the `apis/` directory:

- **Authentication**: Login, signup, profile management
- **Books**: CRUD operations, search, filtering
- **Issues**: Issue books, return books, track overdue

## Key Features Explained

### Authentication Flow
1. User registers/logs in through forms
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes check authentication status
5. Admin routes additionally check user role

### Book Management
- Books are displayed in a responsive grid
- Search functionality filters by title and author
- Category filtering allows browsing by book type
- Each book shows availability status and pricing
- PDF links are provided for digital access

### Issue Management
- Users can issue books with custom due dates
- System automatically calculates fines for late returns
- Damage assessment is included in return process
- Users can track their borrowing history

### Admin Features
- Comprehensive dashboard with system statistics
- Full CRUD operations for books
- Complete issue management and tracking
- User role management capabilities

## Customization

### Styling
The app uses Tailwind CSS for styling. Custom styles can be added to `src/index.css`.

### API Configuration
Update the `API_BASE_URL` in `src/apis/axiosInstance.js` to point to your backend server.

### Routes
Add new routes in `src/App.jsx` following the existing pattern.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Team Shiksha LMS system.
