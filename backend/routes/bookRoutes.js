import { Router } from "express";

const router = Router();
import { addBook, getAllBooks, getBookById, updateBook, deleteBook, issueBook, returnBook } from "../controllers/bookController.js";

// router.use("/",(req, res)=>{
//     res.json({message:"Testing"})
// })
// 📘 Add a new book
router.post("/add", addBook);

// 📚 Get all books
router.get("/", getAllBooks);

// 🔍 Get a single book by ID
router.get("/:id", getBookById);

// ✏️ Update book details
router.put("/:id", updateBook);

// 🗑️ Delete a book
router.delete("/:id", deleteBook);

// 📖 Issue a book to a user
router.post("/issue", issueBook);

// 🔁 Return a book and update availability
router.post("/return", returnBook);

export default router;
