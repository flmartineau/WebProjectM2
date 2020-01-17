const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
require('../models/agendaEvent');
require('../models/user');
require('../models/contact');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');
const AgendaEvent = mongoose.model('AgendaEvent');
const Contact = mongoose.model('Contact');
const User = mongoose.model('User');


/**
 * Create a new project.
 */
module.exports.addProject = (req, res) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!user) res.status(404).json({ status: false, message: 'Utilisateur non trouvé' });
        else {
            const project = new Project();
            const githubRepository = new APIReference();
            const discordServer = new APIReference();
            const trello = new APIReference();
            githubRepository.save();
            discordServer.save();
            trello.save();
            project.name = req.body.name;
            project.description = req.body.description;
            project.githubRepository = githubRepository;
            project.discord = discordServer;
            project.trello = trello;
            project.owner = user;
            project.save().then(
                () => {
                    res.status(201).json({
                        message: 'Project added successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    });
};

/**
 * Delete a project.
 */
module.exports.deleteProject = (req, res) => {
    Project.findOne({ _id: req.params.projectId })
        .populate('agendaEvents')
        .populate('githubRepository')
        .populate('discord')
        .populate('trello')
        .exec(function (err, project) {
            if (err) { res.json({ error: 'error' }); }
            project.agendaEvents.forEach(event => {
                AgendaEvent.deleteOne({ _id: event._id }).then(
                    () => { }
                ).catch(
                    (error) => { }
                );
            });
            project.contacts.forEach(contact => {
                Contact.deleteOne({ _id: contact._id }).then(
                    () => { }
                ).catch(
                    (error) => { }
                );
            });
            project.notes.forEach(note => {
                Note.deleteOne({ _id: note._id }).then(
                    () => { }
                ).catch(
                    (error) => { }
                );
            });
            APIReference.deleteOne({$or: [
                { _id: project.githubRepository._id },
                { _id: project.discord._id}
            ]}).then(
                () => { }
            ).catch(
                (error) => { }
            );

            Project.deleteOne({ _id: req.params.projectId }).then(
                () => {
                    res.status(200).json({
                        message: 'Project deleted!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        })
};

/**
 * Get a project from its id.
 */
module.exports.getProjectById = (req, res) => {
    Project.findOne({ _id: req.params.projectId })
    .populate('githubRepository')
    .populate('discord')
    .populate('owner')
    .populate('trello')
    .then(
        (project) => {
            res.status(200).json(project);
        }).catch(
            (error) => {
                console.log(error)
                res.status(404).json({
                    error: error
                })
            }
        );
};

/**
 * Update the Github Reference of the project.
 */
module.exports.updateProjectGithub = (req, res) => {
        Project.findOne({ _id: req.params.projectId }, (err, project) => {
            if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
            else {
                APIReference.findOne({ _id: project.githubRepository._id }, (err, apiRef) => {
                    apiRef.link = req.body.githubLink;
                    apiRef.tokenAPI = req.body.githubToken;
                    apiRef.usernameAPI = req.body.githubUsername;
                    apiRef.save(function (err) {
                        if (!err)
                            res.send({ success: 'Updated with success' });
                    });
                });
            }
        }).populate('githubRepository');
};

/**
 * Update a project.
 */
module.exports.updateProject = (req, res) => {
    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
        else {
            project.name = req.body.name;
            project.description = req.body.description;
            project.save(function (err) {
                if (!err)
                    res.send({ success: 'Updated with success' });
            });
        }
    });
};

/**
 * Get all the projects.
 */
module.exports.getAllProjects = (req, res) => {
    Project.find({'owner': req._id}).then(
        (projects) => {
            res.status(200).json(projects);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};