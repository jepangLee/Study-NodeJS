const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    const user = new User({
        id : req.body.id,
        name: req.body.name,
        age: req.body.age,
    });

    try {
        const result = await user.save();
        console.log(result);
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

