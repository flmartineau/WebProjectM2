const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    githubRepository: {
        type: Schema.Types.ObjectId,
        ref: 'APIReference'
    },
    overleafLink: {
        type: String
    },
    slack: {
        type: Schema.Types.ObjectId,
        ref: 'APIReference'
    },
    discord: {
        type: Schema.Types.ObjectId,
        ref: 'APIReference'
    }
});


module.exports = mongoose.model('Project', projectSchema);
