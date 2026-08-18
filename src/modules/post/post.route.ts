import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.post('/posts', postController.post);

export const postRoutes = router;