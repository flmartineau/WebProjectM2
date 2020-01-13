const mongoose = require('mongoose');
require('../models/project');
require('../models/apiReference');
require('../models/agendaEvent');
const Project = mongoose.model('Project');
const APIReference = mongoose.model('APIReference');
const AgendaEvent = mongoose.model('AgendaEvent');


/**
 * Create a new project.
 */
module.exports.addProject = (req, res) => {
    const project = new Project();
    project.name = req.body.name;
    project.description = req.body.description;
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
};

/**
 * Delete a project.
 */
module.exports.deleteProject = (req, res) => {
    Project.findOne({ _id: req.params.projectId })
        .populate('agendaEvents')
        .populate('githubRepository')
        .exec(function (err, project) {
            if (err) { res.json({ error: 'error' }); }
            project.agendaEvents.forEach(event => {
                AgendaEvent.deleteOne({ _id: event._id }).then(
                    () => { }
                ).catch(
                    (error) => { }
                );
            });
            APIReference.deleteOne({ _id: project.githubRepository._id }).then(
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
    Project.findOne({ _id: req.params.projectId }).populate('githubRepository').then(
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
 * Add a Github Reference to the project.
 */
module.exports.addProjectGithub = (req, res) => {
    const githubRepository = new APIReference();
    githubRepository.link = req.body.githubLink;
    githubRepository.tokenAPI = req.body.githubToken;
    githubRepository.usernameAPI = req.body.githubUsername;
    githubRepository.save().then(()=> {
        Project.findOne({ _id: req.params.projectId }, (err, project) => {
            if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
            else {
                project.githubRepository = githubRepository;
                project.save(function (err) {
                    if (!err)
                        res.send({ success: 'Created with success' });
                });
            }
        })
    });
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
    Project.find().then(
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