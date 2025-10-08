import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </main>
        <footer className="bg-gray-900 text-white py-4 text-center">
          <p>© {new Date().getFullYear()} Team Shiksha LMS. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
