const mongoose = require('mongoose');
require('../models/project');
const Project = mongoose.model('Project');

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

module.exports.getProjectById = (req, res, next) => {

};

module.exports.updateProject = (req, res, next) => {

};

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