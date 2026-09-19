import { Router } from "express";
import { commentController } from "./comment.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router();

// router.post('/', commentController.createComment)

// router.get('/author/:authorId', commentController.getCommentByAuthorId);

// router.get('/:postId', commentController.getCommentByPostId);

// router.patch('/:commentId', commentController.updateComment);

// router.delete('/:commentId', commentController.deleteComment);

// router.put('/:commentId/moderate', commentController.moderateComment)

router.post('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.createComment);

router.get('/author/:authorId', commentController.getCommentByAuthorId);

router.get('/:postId', commentController.getCommentByPostId);

router.patch('/:commentId', auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.updateComment);

router.delete('/:commentId', auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.deleteComment);

router.put('/:commentId/moderate', auth(Role.ADMIN), commentController.moderateComment);
export const commentRoutes = router;