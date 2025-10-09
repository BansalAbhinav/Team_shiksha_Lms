import Book from '../models/book';
import Issue from '../models/issue';

// -------------------- BOOK CONTROLLERS --------------------

// Create a new book
export async function createBook(req, res) {
  try {
    const { title, author, category, cost, pdfLink, totalQuantity } = req.body;
    const book = new Book({
      title,
      author,
      category,
      cost,
      pdfLink,
      totalQuantity,
      availableQuantity: totalQuantity
    });
    await book.save();
    res.status(201).json({ success: true, message: "Book created successfully", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating book", error: error.message });
  }
}

// Get all books
export async function getAllBooks(req, res) {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
    const books = await Book.find(query);
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching books", error: error.message });
  }
}

// Get book by ID
export async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching book", error: error.message });
  }
}

// Update book
export async function updateBook(req, res) {
  try {
    const { title, author, category, cost, pdfLink, totalQuantity } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, category, cost, pdfLink, totalQuantity },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, message: "Book updated successfully", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating book", error: error.message });
  }
}

// Delete book
export async function deleteBook(req, res) {
  try {
    const activeIssues = await Issue.countDocuments({ bookId: req.params.id, returned: false });
    if (activeIssues > 0)
      return res.status(400).json({ success: false, message: "Cannot delete book with active issues" });
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting book", error: error.message });
  }
}

// Get categories
export async function getCategories(req, res) {
  try {
    const categories = await Book.distinct("category");
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
}

// Get books by category
export async function getBooksByCategory(req, res) {
  try {
    const { category } = req.params;
    const validCategories = ["Fiction", "Non-Fiction", "Academic"];
    if (!validCategories.includes(category))
      return res.status(400).json({ success: false, message: "Invalid category" });
    const books = await Book.find({ category });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching books by category", error: error.message });
  }
}

// Check availability
export async function checkAvailability(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({
      success: true,
      data: {
        bookId: book._id,
        title: book.title,
        totalQuantity: book.totalQuantity,
        availableQuantity: book.availableQuantity,
        isAvailable: book.availableQuantity > 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking availability", error: error.message });
  }
}


// -------------------- ISSUE CONTROLLERS --------------------

// Issue a book
export async function issueBook(req, res) {
  try {
    const { userId, bookId, issueType, groupSize } = req.body;

    // 1️⃣ Check if user already has an active book
    const existingIssue = await Issue.findOne({ userId, returned: false });
    if (existingIssue)
      return res.status(400).json({ success: false, message: "User already has an active book issued" });

    // 2️⃣ Check book availability
    const book = await Book.findOneAndUpdate(
      { _id: bookId, availableQuantity: { $gt: 0 } },
      { $inc: { availableQuantity: -1 } },
      { new: true }
    );
    if (!book) return res.status(400).json({ success: false, message: "Book not available" });

    // 3️⃣ Set issue and due date
    const issueDate = new Date();
    const dueDate = new Date();

    if (issueType === "individual") {
      if (groupSize && groupSize > 1)
        return res.status(400).json({ success: false, message: "Individual issue cannot have group size > 1" });
      dueDate.setDate(dueDate.getDate() + 30);
    } else if (issueType === "group") {
      if (!groupSize || groupSize < 3 || groupSize > 6)
        return res.status(400).json({ success: false, message: "Group size must be 3-6" });
      dueDate.setDate(dueDate.getDate() + 180);
    } else return res.status(400).json({ success: false, message: "Invalid issue type" });

    // 4️⃣ Save issue record
    const issue = new Issue({ userId, bookId, issueType, issueDate, dueDate });
    await issue.save();

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: { issue, remainingCopies: book.availableQuantity }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error issuing book", error: error.message });
  }
}

// Return a book + fine logic
export async function returnBook(req, res) {
  try {
    const { issueId, damageType } = req.body;

    const issue = await Issue.findById(issueId).populate('bookId');
    if (!issue) return res.status(404).json({ success: false, message: "Issue record not found" });
    if (issue.returned) return res.status(400).json({ success: false, message: "Book already returned" });

    const book = issue.bookId;
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    const today = new Date();
    const lateDays = Math.max(0, Math.floor((today - issue.dueDate) / (1000 * 60 * 60 * 24)));
    let fine = 0;

    // Fine rules
    if (lateDays > 0) {
      fine += book.cost * 2; // Missing book
      fine += lateDays * 50; // Late fee per day
    }

    // Damage rules
    if (damageType === 'small') fine += book.cost * 0.1;
    if (damageType === 'large') fine += book.cost * 0.5;

    // Update issue record
    issue.returned = true;
    issue.returnDate = today;
    issue.fine = fine;
    issue.lateDays = lateDays;
    issue.damageType = damageType || 'none';
    await issue.save();

    // Update book stock
    await Book.findByIdAndUpdate(book._id, { $inc: { availableQuantity: 1 } });

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: {
        issueId: issue._id,
        bookTitle: book.title,
        fine,
        lateDays,
        damageType: damageType || 'none',
        totalReturnedCopies: book.availableQuantity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error returning book", error: error.message });
  }
}

// Get all issues
export async function getAllIssues(req, res) {
  try {
    const { userId, returned } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (returned !== undefined) query.returned = returned === 'true';

    const issues = await Issue.find(query)
      .populate('userId', 'name email')
      .populate('bookId', 'title author category')
      .sort({ issueDate: -1 });

    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching issues", error: error.message });
  }
}

// Get issue by ID
export async function getIssueById(req, res) {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author category');
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });
    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching issue", error: error.message });
  }
}

// Get overdue books
export async function getOverdueBooks(req, res) {
  try {
    const overdueIssues = await Issue.find({ returned: false, dueDate: { $lt: new Date() } })
      .populate('userId', 'name email')
      .populate('bookId', 'title author category');

    res.status(200).json({ success: true, count: overdueIssues.length, data: overdueIssues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching overdue books", error: error.message });
  }
}
