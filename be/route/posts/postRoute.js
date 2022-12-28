const express = require('express');
const { createPostCtrl, fetchPostsCtrl, fetchPostCtrl, updatePostCtrl, deletePostCtrl } = require('../../controllers/posts/postCtrl');
const authMiddleware = require('../../middlewares/auth/auth');
const { postsPhotoUpload } = require('../../middlewares/uploads/profilePhotoUpload');

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, postsPhotoUpload.single('image'), createPostCtrl)
postRoutes.get('/', authMiddleware, fetchPostsCtrl);
postRoutes.get('/:id', authMiddleware, fetchPostCtrl)
postRoutes.put('/:id', authMiddleware, updatePostCtrl)
postRoutes.delete('/:id', authMiddleware, deletePostCtrl)

module.exports = postRoutes;