const mongoose = require('mongoose');
require('../models/agendaEvent');
const AgendaEvent = mongoose.model('AgendaEvent');

/**
 * Create a new event.
 */
module.exports.addEvent = (req, res, next) => {
    console.log("tartanpion");
    const event = new AgendaEvent();
    event.name = req.body.name;
    event.description = req.body.description;
    event.date = req.body.date;
    event.save().then(
        () => {
            res.status(201).json({
                message: 'Event added successfully!'
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
    AgendaEvent.find().then(
        (events) => {
            res.status(200).json(events);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};