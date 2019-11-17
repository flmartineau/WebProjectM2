const mongoose = require('mongoose');

require('./../models/user');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    const user = new User();
    console.log(req.body);
};