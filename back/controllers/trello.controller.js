const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');

/**
 * Update the trello reference of the project.
 */
module.exports.updateTrello = (req, res, next) => {

    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (!project) res.status(404).json({ status: false, message: 'Project not found.' });
        else {

            APIReference.findOne({ _id: project.trello._id }, (err, trello) => {
                trello.link = req.body.trelloBoardUrl;
                trello.tokenAPI = req.body.trelloToken;
                trello.usernameAPI = req.body.trelloKey;
                trello.save().then(
                    () => {
                        res.status(204).send({ success: 'Trello updated with success.' });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({ error: error });
                    }
                );
            });
        }
    })

};
