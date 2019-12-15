const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');


module.exports.createUser = (req, res, next) => {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    console.log(user);
    user.save((err, doc) => {
        if (!err) {
            res.send(doc);
            console.log("Ajouté")}
        else {
            if (err.code === 11000)
                res.status(442).send(['L\'email existe déja !']);
            else
                next(err);
        }
    });
};

module.exports.loginUser = (req, res, next) => {
    console.log("login");
    //passport.authenticate
};

module.exports.deleteUser = (req, res, next) => {

};

module.exports.getUser = (req, res, next) => {

};

module.exports.logoutUser = (req, res, next) => {

};

module.exports.updateUser = (req, res, next) => {

};
