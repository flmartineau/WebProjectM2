const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitationSchema = new mongoose.Schema({
    creationDate: {
        type: Date,
        required:true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
});


module.exports = mongoose.model('Invitation', invitationSchema);
