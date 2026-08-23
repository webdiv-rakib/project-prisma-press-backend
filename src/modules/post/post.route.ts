import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

// create your post
router.post('/', postController.createPost);

// get all posts
router.get('/', postController.getAllPosts);

// 
router.get('/stats', postController.getPostsStats);

// get 
router.get('/my-posts', postController.getMyPost);

router.get('/:postId', postController.getPostById);

router.patch('/:postId', postController.updatePost);

router.delete('/:postId', postController.deletePost);

export const postRoutes = router;