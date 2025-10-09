import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Books from "./pages/Books";
import MyBooks from "./pages/MyBooks";
import BookDetailPage from "./pages/BookDetailPage";
import Contact from "./pages/Contact";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route 
                path="/my-books" 
                element={
                  <ProtectedRoute>
                    <MyBooks />
                  </ProtectedRoute>
                } 
              />
              
          
            </Routes>
          </main>
          <footer className="bg-gray-900 text-white py-4 text-center">
            <p>© {new Date().getFullYear()} Team Shiksha LMS. All rights reserved.</p>
          </footer>
        </div>
      </Router>
      <ToastContainer 
        autoClose={2000} 
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;