const mongoose = require('mongoose');
require('../models/note');
const Project = mongoose.model('Project');
const Note = mongoose.model('Note');

/**
 * Create a new note.
 */

module.exports.addNote = (req, res, next) => {
    const note = new Note();
    note.title = req.body.title;
    note.description = req.body.description;
    note.save().then(
        () => {
            Project.findOne({ _id: req.params.projectId }, (err, project) => {
                if (project) {
                    project.notes.push(note);
                    project.save();
                    res.status(201).json({ message: 'Note added successfully!' });
                }
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

module.exports.deleteNote = (req, res, next) => {
    Note.deleteOne({_id: req.params.noteId}).then(
        () => {
            res.status(200).json({
                message: 'Note deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

module.exports.getNote = (req, res, next) => {
    Notes.findOne({ _id: req.params.noteId }).then(
        (note) => {
            res.status(200).json(note);
        }).catch(
            (error) => {
                console.log(error)
                res.status(404).json({
                    error: error
                })
            }
        );
};

module.exports.getNotes = (req, res, next) => {
    Project.findOne({ _id: req.params.projectId })
        .populate('notes')
        .exec(function (err, project) {
            if (err) res.json({ error: 'error' });
            res.json({ notes: project.notes });
        });
};

module.exports.updateNote = (req, res, next) => {
    Notes.findOne({ _id: req.params.noteId }, (err, note) => {
        if (!note) {
            res.status(404).json({ status: false, message: 'Note not found' });
        } else {
            note.title = req.body.title;
            note.description = req.body.description;
            note.save(function (err) {
                if (!err)
                    res.send({ success: 'Note updated with success' });
            });
        }
    });
};
