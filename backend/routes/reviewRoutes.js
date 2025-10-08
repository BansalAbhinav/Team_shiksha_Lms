import { Router } from "express";
import { addReview, getReviewsByBookId, updateReview } from "../controllers/reviewController.js";
const router = Router();


router.post("/add", addReview);
router.get("/book/:bookId", getReviewsByBookId);
router.put("/:id", updateReview);



export default router;