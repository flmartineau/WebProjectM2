const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'Le prenom est obligatoire'
    },
    lastName: {
        type: String,
        required: 'Le nom est obligatoire'
    },
    email: {
        type: String,
        required: 'L\'email est obligatoire'
    }
});

contactSchema.path('email').validate((val) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'L\'email n\'est pas valide');

module.exports = mongoose.model('Contact', contactSchema);
