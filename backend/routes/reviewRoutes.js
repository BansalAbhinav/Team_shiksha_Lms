import { Router } from "express";
import { addReview } from "../controllers/reviewController.js";
const router = Router();


router.post("/add", addReview);


export default router;