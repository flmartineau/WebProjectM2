const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');

/**
 * Update the trello reference of the project.
 */
module.exports.updateTrello = (req, res, next) => {
    const trello = new APIReference();
    trello.link = req.body.trelloBoardId;
    trello.tokenAPI = req.body.trelloToken;
    trello.usernameAPI = req.body.trelloKey;

    trello.save().then(() => {
        Project.findOne({ _id: req.params.projectId }, (err, project) => {
            if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
            else {
                project.trello = trello;
                project.save(function (err) {
                    if (!err)
                        res.send({ success: 'Created with success' });
                });
            }
        })
    });
};
