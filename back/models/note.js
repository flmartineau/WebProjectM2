const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Le titre est obligatoire"
    },
    description: {
        type: String
    }
});


module.exports = mongoose.model('Note', noteSchema);