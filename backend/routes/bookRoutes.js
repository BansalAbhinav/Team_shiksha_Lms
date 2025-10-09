import { Router } from 'express';
const router = Router();
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, getCategories, getBooksByCategory, checkAvailability, issueBook, returnBook, getAllIssues, getIssueById, getOverdueBooks, getMyIssues } from '../controllers/bookController.js';
import { verifyJwt } from './authRoutes.js';

// -------------------- PUBLIC BOOK ROUTES (No Auth Required) --------------------
router.get('/books', getAllBooks); 
router.get('/books/:id', getBookById);  
router.get('/categories', getCategories); 
router.get('/books/category/:category', getBooksByCategory);
router.get('/books/:id/availability', checkAvailability);

// -------------------- PROTECTED BOOK ROUTES (Auth Required) --------------------
router.post('/books', verifyJwt, createBook); 
router.put('/books/:id', verifyJwt, updateBook); 
router.delete('/books/:id', verifyJwt, deleteBook); 

// -------------------- ISSUE ROUTES (Auth Required) --------------------
router.post('/issues', verifyJwt, issueBook);
router.put('/issues/return', verifyJwt, returnBook);
router.get('/issues', verifyJwt, getAllIssues);
router.get('/issues/my', verifyJwt, getMyIssues);
router.get('/issues/:id', verifyJwt, getIssueById);
router.get('/issues/overdue', verifyJwt, getOverdueBooks);

export default router;
