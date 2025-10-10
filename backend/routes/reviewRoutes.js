import { Router } from "express";
import {
  addReview,
  deleteReview,
  getBookAverageRating,
  getReviewsByBookId,
  getReviewsByUser,
  getReviewById,
  updateReview,
} from "../controllers/reviewController.js";
import { verifyJwt } from "./authRoutes.js";

const router = Router();

router.get("/book/:bookId", getReviewsByBookId);
router.get("/review/:reviewId", getReviewById);
router.get("/average/:bookId", getBookAverageRating);

router.post("/add", verifyJwt, addReview);
router.get("/user/:userId", verifyJwt, getReviewsByUser);
router.put("/:id", verifyJwt, updateReview);
router.delete("/:id", verifyJwt, deleteReview);


export default router;
