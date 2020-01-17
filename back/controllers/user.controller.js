const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

/**
 * Create a new user.
 */
module.exports.createUser = (req, res, next) => {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err) {
            res.send(doc);
            console.log("Ajouté")}
        else {
            console.log(err)
            if (err.code === 11000)
                res.status(442).send(['L\'email existe déja !']);
            else
                next(err);
        }
    });
};

/**
 * Log user.
 */
module.exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) res.status(400).json(err);
        else
        if (user) {
            const token = user.generateJwt();
            res.cookie('token', token, { maxAge: 3600 * 60 * 1000,httpOnly: true});
            res.status(200).json({ 'token': token });
        }
        else res.status(404).json(info);
    })(req, res);
};


/**
 * Get the current user.
 */
module.exports.getUser = (req, res, next) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!user) res.status(404).json({ status: false, message: 'Utilisateur non trouvé' });
        else {
            res.status(200).json(user);
        }
    });
};

/**
 * Log out the current user.
 */
module.exports.logoutUser = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({success: 'Logout with success !' });
};



/**
 * Update the current user info.
 */
module.exports.updateUser = (req, res, next) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!user) res.status(404).json({ status: false, message: 'User not found' });
        else {
            console.log(req.body);
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.save((err, doc) => {
                if (!err) {
                    res.send(doc);
                    console.log("Modifié")
                }
                else {
                    console.log(err)
                    if (err.code === 11000)
                        res.status(442).send(['L\'email existe déja !']);
                    else
                        next(err);
                }
            });
        }
    });
};
