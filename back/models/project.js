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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    githubRepository: {
        type: Schema.Types.ObjectId,
        ref: 'APIReference'
    },
    discord: {
        type: Schema.Types.ObjectId,
        ref: 'APIReference'
    },
    agendaEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'AgendaEvent'
    }]
});


module.exports = mongoose.model('Project', projectSchema);
