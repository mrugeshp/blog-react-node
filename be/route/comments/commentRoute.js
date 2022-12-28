const express = require('express');
const { createCommentCtrl, featchAllCommentsCtrl, featchCommentCtrl, updateCommentCtrl, deleteCommentCtrl } = require('../../controllers/comments/commentsCtrl');
const authMiddleware = require('../../middlewares/auth/auth');

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentCtrl);
commentRoutes.get("/", authMiddleware, featchAllCommentsCtrl);
commentRoutes.get("/:id", authMiddleware, featchCommentCtrl);
commentRoutes.put("/:id", authMiddleware, updateCommentCtrl);
commentRoutes.delete("/:id", authMiddleware, deleteCommentCtrl);

module.exports = commentRoutes;