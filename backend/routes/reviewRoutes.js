import { Router } from "express";
import { 
  addReview, 
  deleteReview, 
  getBookAverageRating, 
  getReviewsByBookId, 
  getReviewsByUser,
  getReviewById,
  updateReview 
} from "../controllers/reviewController.js";

const router = Router();

router.post("/add", addReview);
router.get("/book/:bookId", getReviewsByBookId);
router.get("/user/:userId", getReviewsByUser);       
router.get("/review/:reviewId", getReviewById);      
router.get("/average/:bookId", getBookAverageRating);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;