const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');


/**
 * Update the discord reference of the project.
 */
module.exports.updateDiscord = (req, res, next) => {
    const discordServer = new APIReference();
    discordServer.link = req.body.discordServerID+"/"+req.body.discordChannelID;
    //discordServer.tokenAPI = null;
    //discordServer.usernameAPI = null;
    discordServer.save().then(() => {
        Project.findOne({ _id: req.params.projectId }, (err, project) => {
            if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
            else {
                project.discord = discordServer;
                project.save(function (err) {
                    if (!err)
                        res.send({ success: 'Created with success' });
                });
            }
        })
    });
};
