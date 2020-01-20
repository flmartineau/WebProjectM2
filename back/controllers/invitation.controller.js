const mongoose = require('mongoose');
const Project = require('../models/project');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const Member = require('../models/member');

/**
 * Invite a user to a project.
 */
module.exports.invitUserToProject = (req, res, next) => {
    const invitation = new Invitation();
    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (project) {
            User.findOne({ _id: req.body.userId }, (err, user) => {
                if (user) {
                    invitation.creationDate = new Date();
                    invitation.project = project;
                    invitation.user = user;
                    invitation.save().then(
                        () => {  
                            res.status(201).json({ message: 'Invitation added with success.' });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({ error: error });
                        }
                    );
                } else {
                    res.status(400).json({ error: error });
                }
            });
        } else {
            res.status(400).json({ error: error });
        }
    });
};

/**
 * Accept an invitation to a project.
 */
module.exports.acceptInvitation = (req, res, next) => {
    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (project) {
            User.findOne({ _id: req._id }, (err, user) => {
                if (user) {
                    Invitation.findOne({ user: user, project: project }, (err, invitation) => {
                        if (invitation) {
                            const member = new Member();
                            member.user = user;
                            member.project = project;
                            member.save().then(
                                () => {  
                                    Invitation.deleteOne(invitation).then(
                                        () => {
                                            res.status(201).json({ message: 'Invitation acpeted with success.' });
                                        }
                                    ).catch(
                                        (error) => { res.status(400).json({ error: error }); }
                                    );
                                }
                            ).catch(
                                (error) => {
                                    res.status(400).json({ error: error });
                                }
                            );
                        } else {
                            res.status(400).json({ error: error });
                        }
                    });
                } else {
                    res.status(400).json({ error: error });
                }
            });
        } else {
            res.status(400).json({ error: error });
        }
    });
};

/**
 * Deny an invitation to a project.
 */
module.exports.denyInvitation = (req, res, next) => {
    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (project) {
            User.findOne({ _id: req._id }, (err, user) => {
                if (user) {
                    Invitation.findOne({ user: user, project: project }, (err, invitation) => {
                        if (invitation) {
                            
                            Invitation.deleteOne(invitation).then(
                                () => {
                                    res.status(201).json({ message: 'Invitation denied with success.' });
                                }
                            ).catch(
                                (error) => { res.status(400).json({ error: error }); }
                            );
                                 
                        } else {
                            res.status(400).json({ error: error });
                        }
                    });
                } else {
                    res.status(400).json({ error: error });
                }
            });
        } else {
            res.status(400).json({ error: error });
        }
    });
};

/**
 * Get all invitations from current user
 */
module.exports.getUserInvitations = (req, res, next) => {

    User.findOne({ _id: req._id }, (err, user) => {
        if (user) {
            Invitation.find({ user: user }, (err, invitations) => {
                if (!invitations) {
                    res.status(404).json({ status: false, message: 'Invitations not found.' });
                } else {
                    res.status(200).json(invitations);
                }
            });
        } else {
            res.status(400).json({ error: error });
        }
    });
};

/**
 * Get all Invitations.
 */
module.exports.getUsers = (req, res, next) => {
    Invitation.find( (err, invitations) => {
        if (!invitations) {
            res.status(404).json({ status: false, message: 'Invitations not found.' });
        } else {
            res.status(200).json(invitations);
        }
    });
};
