const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Le nom est obligatoire'
    },
    email: {
        type: String,
        required: 'L\'email est obligatoire',
        unique: true
    },
    password: {
        type: String,
        required: 'Le mot de passe est obligatoire',
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    }
});

userSchema.path('email').validate((val) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'L\'email n\'est pas valide');

userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            next();
        });
    });
});

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id}
        ,process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXP
        });
};


module.exports = mongoose.model('User', userSchema);
