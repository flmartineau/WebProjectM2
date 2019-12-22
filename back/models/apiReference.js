const mongoose = require('mongoose');

const apiReferenceSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    usernameAPI: {
        type: String
    },
    tokenAPI: {
        type: String
    }
});


module.exports = mongoose.model('APIReference', apiReferenceSchema);
