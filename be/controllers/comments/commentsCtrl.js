const expressAsyncHandler = require('express-async-handler');
const Filter = require("bad-words");
const Post = require('../../model/Post');
const User = require('../../model/User');
const Comment = require('../../model/Comment');
const validateMongodbId = require('../../utils/validateMongodbId');

// Create comment
const createCommentCtrl = expressAsyncHandler(async (req, res, next) => {
    const { postId, description } = req.body
    try {
        const comment = await Comment.create({
            'description': description,
            'user': req.user,
            'post': postId 
        })
        res.json(comment)
    }
    catch (error) {
        res.json(error);
    }
})

// featch all comments
const featchAllCommentsCtrl = expressAsyncHandler(async (req, res, next) => {
    try {
        const comments = await Comment.find({}).sort('-created');
        res.json(comments);
    } catch (error) {
        res.json(error)
    }
})

// fetch comment
const featchCommentCtrl = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const comment = await Comment.findById(id).sort('-created');
        res.json(comment);
    } catch (error) {
        res.json(error)
    }
})

// Update comment
const updateCommentCtrl = expressAsyncHandler(async (req, res, next) => {
    const { postId, description } = req.body
    const commentId = req.params.id;
    validateMongodbId(commentId);
    try {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            {
                'description': description,
                'user': req.user,
                'post': postId 
            },
            { new: true })
        res.json(comment)
    }
    catch (error) {
        res.json(error);
    }
})

// delete comment
const deleteCommentCtrl = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const comment = await Comment.findByIdAndDelete(id)
        res.json(comment);
    }
    catch (error) {
        res.json(error);
    }
})

module.exports = {
    createCommentCtrl,
    featchAllCommentsCtrl,
    featchCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
}