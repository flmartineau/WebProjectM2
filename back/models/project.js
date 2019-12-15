const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    githubRepository: {
        type: String
    },
    overleafLink: {
        type: String
    },
    slack: {
        type: String //temp
    },
    discord: {
        type: String //temp
    }
});


module.exports = mongoose.model('Project', projectSchema);
