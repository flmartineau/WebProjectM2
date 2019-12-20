const mongoose = require('mongoose');
require('../models/project');
const Project = mongoose.model('Project');


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
                message: 'Proect added successfully!'
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
    Project.deleteOne({_id: req.params.projectId}).then(
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
};

/**
 * Get a project from its id.
 */
module.exports.getProjectById = (req, res) => {
    Project.findOne({ _id: req.params.projectId }).then(
        (project) => {
            res.status(200).json(project);
        }).catch(
            (error) => {
                res.status(404).json({
                    error: error
                })
            }
        );
};

/**
 * Modify the Github URL of the project.
 */
module.exports.updateProjectGithub = (req, res) => {
    Project.findOne({ _id: req.params.projectId }, (err, project) => {
        if (!project) res.status(404).json({ status: false, message: 'Projet non trouvé' });
        else {
            project.githubRepository = req.body.githubRepository
            project.save(function (err) {
                if (!err)
                    res.send({ success: 'Updated with success' });
            });
        }
    });
};

/**
 * Update a project.
 */
module.exports.updateProject = (req, res) => {
    const project = new Project({
        _id: req.params.projectId,
        name: req.body.name,
        description: req.body.description,
        githubRepository: req.body.githubRepository,
        overleafLink: req.body.overleafLink,
        slack: req.body.slack,
        discord: req.body.discord
    });

    Project.updateOne(({ _id: req.params.projectId }, project)).then(
        () => {
            res.status(201).json({
                message: 'Project updated successfully!'
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