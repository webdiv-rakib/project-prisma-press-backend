import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { postController } from "./post.controller";

const router = Router();

// create your post
router.post('/', auth(Role.USER, Role.AUTHOR, Role.ADMIN), postController.createPost);

// get all posts
router.get('/', postController.getAllPosts);

// 
router.get('/stats', postController.getPostsStats);

// get 
router.get('/my-posts', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.getMyPost);

router.get('/:postId', postController.getPostById);

router.patch('/:postId', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.updatePost);

router.delete('/:postId', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.deletePost);


export const postRoutes = router;