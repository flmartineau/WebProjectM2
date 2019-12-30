const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agendaEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('AgendaEvent', agendaEventSchema);
