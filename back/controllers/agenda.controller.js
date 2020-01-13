const mongoose = require('mongoose');
require('../models/agendaEvent');
const Project = mongoose.model('Project');
const AgendaEvent = mongoose.model('AgendaEvent');

/**
 * Create a new event.
 */
module.exports.addEvent = (req, res, next) => {
    const event = new AgendaEvent();
    event.name = req.body.name;
    event.description = req.body.description;
    event.date = req.body.date;
    event.save().then(
        () => {
            Project.findOne({ _id: req.params.projectId }, (err, project) => {
                if (project) {
                    project.agendaEvents.push(event);
                    project.save();
                    res.status(201).json({ message: 'Event added successfully!' });
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

/**
 * Get an event from its id.
 */
module.exports.getEventById = (req, res) => {
    console.log(req.params)
    AgendaEvent.findOne({ _id: req.params.eventId }).then(
        (event) => {
            res.status(200).json(event);
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
 * Delete an event.
 */
module.exports.deleteEvent = (req, res, next) => {
    AgendaEvent.deleteOne({_id: req.params.eventId}).then(
        () => {
            res.status(200).json({
                message: 'Event deleted!'
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
 * Update an event.
 */
module.exports.updateEvent = (req, res, next) => {
    AgendaEvent.findOne({ _id: req.params.eventId }, (err, event) => {
        if (!event) {
            res.status(404).json({ status: false, message: 'Event not found' });
        } else {
            event.name = req.body.name;
            event.description = req.body.description;
            event.date = req.body.date;
            event.save(function (err) {
                if (!err)
                    res.send({ success: 'Event updated with success' });
            });
        }
    });
};

/**
 * Get all the events.
 */
module.exports.getAllEvents = (req, res) => {
    Project.findOne({ _id: req.params.projectId })
        .populate('agendaEvents')
        .exec(function (err, project) {
            if (err) res.json({ error: 'error' });
            res.json({ events: project.agendaEvents });
        });
};

/**
 * Get all the events in year-month.
 */
module.exports.getEventsByYearMonth = (req, res) => {
    let numberOfDays = new Date(req.params.year, req.params.month , 0).getDate();
    let first = req.params.year + '-' + req.params.month + '-01';
    let last = req.params.year + '-' + req.params.month + '-' + numberOfDays;
    let resEvents = [];
    Project.findOne({ _id: req.params.projectId })
        .populate('agendaEvents')
        .exec(function (err, project) {
            if (err) {res.json({ error: 'error' });}
                project.agendaEvents.forEach(event => {
                    let eventDate = new Date(event.date);
                    if(+eventDate >= +new Date(first) && +eventDate <= +new Date(last)){
                        resEvents.push(event);
                    }
                });
                res.status(200).json(resEvents);
        }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );

};