import { Router } from 'express';
const router = Router();
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, getCategories, getBooksByCategory, checkAvailability, issueBook, returnBook, getAllIssues, getIssueById, getOverdueBooks, getMyIssues } from '../controllers/bookController.js';
import { verifyJwt } from './authRoutes.js';

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
router.post('/issues', verifyJwt, issueBook);
router.put('/issues/return', verifyJwt, returnBook);
router.get('/issues', verifyJwt, getAllIssues);
router.get('/issues/my', verifyJwt, getMyIssues);
router.get('/issues/:id', verifyJwt, getIssueById);
router.get('/issues/overdue', verifyJwt, getOverdueBooks);

export default router;
