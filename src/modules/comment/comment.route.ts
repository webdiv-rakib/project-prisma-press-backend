import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();
router.post('/comments', commentController.comment)

export const commentRoutes = router;