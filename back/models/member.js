const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new mongoose.Schema({
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


module.exports = mongoose.model('Member', memberSchema);
