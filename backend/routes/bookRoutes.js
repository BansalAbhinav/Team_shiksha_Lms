const express = require("express");

const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
} = require("../controllers/bookController");

router.all("/",(req, res)=>{
    res.json({message:"Testing"})
})
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

module.exports = router;
