const expressAsyncHandler = require('express-async-handler');
const Filter = require("bad-words");
const Post = require('../../model/Post');
const User = require('../../model/User');
const validateMongodbId = require('../../utils/validateMongodbId');

// Create post
const createPostCtrl = expressAsyncHandler(async (req, res, next) => {
    try {
        console.log(req.file)
        const { _id } = req.user;
        validateMongodbId(_id);
        // check for bad words
        const filter = new Filter();
        const isProfane = filter.isProfane(req.body.title, req.body.description);
        const localPath = `./public/data/posts/${req.file.filename}`;
        if (isProfane) {
            // Block user
            const user = await User.findByIdAndUpdate(
                _id,
                {
                    isBlocked: true
                }
            )
            throw new Error('Post creation failed due to bad words!')
        }
        const post = await Post.create({
            ...req.body,
            'image': localPath,
            "user": _id
        });
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

// Fetch posts
const fetchPostsCtrl = expressAsyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate('user');
        res.json(posts)
    }
    catch (error) {
        res.json(error);
    }
    res.json('fetch post')
})

// Fetch post
const fetchPostCtrl = expressAsyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    validateMongodbId(postId);
    try {
        const post = await Post.findById(postId).populate('user');
        // increament number of views
        await Post.findByIdAndUpdate(
            postId,
            { $inc: { numViews: 1 }},
            { new: true }
        )
        res.json(post);
    }
    catch (error) {
        res.json(error);
    }
})

// Update post
const updatePostCtrl = expressAsyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    validateMongodbId(postId);
    try {
        const post = await Post.findByIdAndUpdate(
            postId,
            {
               ...req.body
            },
            { new: true }
        )
        res.json(post);
    }
    catch (error) {
        res.json(error);
    }
})

// Delete post
const deletePostCtrl = expressAsyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    validateMongodbId(postId);
    try {
        const post = await Post.findByIdAndDelete(postId);
        res.json(post);
    }
    catch (error) {
        res.json(error)
    }
})

module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl
}