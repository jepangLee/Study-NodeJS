const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const comments = await Comment.find({commenter: req.params.id}).populate('commenter');
        console.log(comments);
        res.json(comments);
    }
    catch (err) {
        console.error(err);
        next(err);
    }


});

router.post('/', async (req, res, next) => {
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });

    try {
        const result = await comment.save();
        await Comment.populate(result, {path: 'commenter'});
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Comment.update({_id: req.params.id}, {comment: req.body.comment});
        res.json(result);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Comment.remove({_id: req.params.id});
        res.json(result);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
