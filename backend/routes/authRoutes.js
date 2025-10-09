import { Router, json } from "express";
const router = Router();
router.use(json());

import pkg from 'jsonwebtoken';
import User from "../models/User.js";
import { genSalt, hash } from "bcrypt";

const { sign, verify } = pkg;
// Signup route
router.post("/signup", async (req, res) => {
       const JWT_SECRET = process.env.JWT_SECRET; 
    const {name, email, password, role} = req.body;
    try {
        const isExistingUser = await User.findOne({email});
        if (isExistingUser) {
            return res.status(400).json({"error": "User already exists. Please login instead."})
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword, role});
        const savedUser = await newUser.save();
        res.status(201).json({"message": "User signup successful."});

    } catch (error) {
        res.status(500).json({"error": "User signed failed"});
    }
})

// Login route
router.post("/login", async (req, res) => {
    try {
        console.log("🔐 Login attempt received");
        console.log("Request body:", req.body);
        
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ 
                success: false, 
                error: "Email and password are required" 
            });
        }

        // Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return res.status(500).json({ 
                success: false, 
                error: "Server configuration error" 
            });
        }

        console.log("🔍 Looking for user with email:", email);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(404).json({ 
                success: false, 
                error: "User not found" 
            });
        }

        console.log("✅ User found, comparing passwords...");
        const isPasswordMatched = await user.comparePassword(password);
        console.log("🔑 Password match result:", isPasswordMatched);

        if (!isPasswordMatched) {
            console.log("Password mismatch for user:", email);
            return res.status(400).json({ 
                success: false, 
                error: "Invalid credentials" 
            });
        }

        console.log("✅ Password matched, generating token...");
        const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "4h" });

        console.log("Login successful for user:", email);
        res.status(200).json({
            success: true,
            message: "Login successful", 
            email: user.email, 
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to login",
            details: error.message 
        });
    }
});

// Middleware for protecting other routes
const verifyJwt = (req, res, next) => {
    
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({"error": "No token provided"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(402).json({"error": "Invalid token."});
    }
}

export { router, verifyJwt };

