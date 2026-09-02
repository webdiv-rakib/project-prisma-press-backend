import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.post('/', commentController.createComment)

router.get('/author/:authorId', commentController.getCommentByAuthorId);

router.get('/:postId', commentController.getCommentByPostId);

router.patch('/:commentId', commentController.updateComment);

router.delete('/:commentId', commentController.deleteComment);

router.put('/:commentId/moderate', commentController.moderateComment)


export const commentRoutes = router;