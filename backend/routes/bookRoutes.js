import { Router } from 'express';
const router = Router();
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, getCategories, getBooksByCategory, checkAvailability, issueBook, returnBook, getAllIssues, getIssueById, getOverdueBooks } from '../controllers/bookController';

// -------------------- BOOK ROUTES --------------------
router.post('/books', createBook);
router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// Category & Filter
router.get('/categories', getCategories);
router.get('/books/category/:category', getBooksByCategory);

// Availability & Download
router.get('/books/:id/availability', checkAvailability);


// -------------------- ISSUE ROUTES --------------------
router.post('/issues', issueBook);
router.put('/issues/return', returnBook);
router.get('/issues', getAllIssues);
router.get('/issues/:id', getIssueById);
router.get('/issues/overdue', getOverdueBooks);

export default router;
