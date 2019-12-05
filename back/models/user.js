const mongoose = require('mongoose');

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