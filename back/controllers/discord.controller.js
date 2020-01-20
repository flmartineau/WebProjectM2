const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');


/**
 * Update the discord reference of the project.
 */
module.exports.updateDiscord = (req, res, next) => {
    console.log(req.body)

    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (!project) res.status(404).json({ status: false, message: 'Project not found.' });
        else {

            APIReference.findOne({ _id: project.discord._id }, (err, discordServer) => {
                discordServer.link = req.body.discordServerID+"/"+req.body.discordChannelID;
                //discordServer.tokenAPI = null;
                //discordServer.usernameAPI = null;
                discordServer.save().then(
                    () => {
                        res.status(204).send({ success: 'Discord updated with success.' });
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
