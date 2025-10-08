const { Book, Issue } = require("../models/Book");

// ➕ Add a new book
exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

// 📚 Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};

// 🔍 Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
};

// ✏️ Update book details
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
};

// 🗑️ Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};

// 📖 Issue a book
exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId, issueType, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableQuantity <= 0)
      return res.status(400).json({ message: "No copies available" });

    // Create issue record
    const issue = new Issue({ userId, bookId, issueType, dueDate });
    await issue.save();

    // Decrease availability
    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json({ message: "Book issued successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Error issuing book", error: error.message });
  }
};

// 🔁 Return a book
exports.returnBook = async (req, res) => {
  try {
    const { issueId } = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue record not found" });

    if (issue.returned)
      return res.status(400).json({ message: "Book already returned" });

    issue.returned = true;
    await issue.save();

    // Increase availability
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.json({ message: "Book returned successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error: error.message });
  }
};
