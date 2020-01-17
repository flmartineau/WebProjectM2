const mongoose = require('mongoose');
const Contact = require('../models/contact');
const Project = mongoose.model('Project');

/**
 * Create a new contact.
 */
module.exports.addContact = (req, res, next) => {
    const contact = new Contact();
    contact.firstName = req.body.firstName;
    contact.lastName = req.body.lastName;
    contact.email = req.body.email;
    contact.save().then(
        () => {
            Project.findOne({ _id: req.params.projectId }, (err, project) => {
                if (project) {
                    project.contacts.push(event);
                    project.save();
                    res.status(201).json({ message: 'Contact added successfully!' });
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
 * Delete a contact by id.
 */
module.exports.deleteContact = (req, res, next) => {
    Contact.deleteOne({_id: req.params.contactId}).then(
        () => {
            res.status(200).json({
                message: 'Contact deleted!'
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
 * Get a contact by id.
 */
module.exports.getContact = (req, res, next) => {
    Contact.findOne({ _id: req.params.contactId }).then(
        (contact) => {
            res.status(200).json(contact);
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
 * Get all contacts.
 */
module.exports.getContacts = (req, res, next) => {
    Project.findOne({ _id: req.params.projectId })
        .populate('contacts')
        .exec(function (err, project) {
            if (err) res.json({ error: 'error' });
            res.json({ contacts: project.contacts });
        });
};

/**
 * Update a contact by id.
 */
module.exports.updateContact = (req, res, next) => {
    Contact.findOne({ _id: req.params.contactId }, (err, contact) => {
        if (!contact) {
            res.status(404).json({ status: false, message: 'Contact not found' });
        } else {
            contact.firstName = req.body.firstName;
            contact.lastName = req.body.lastName;
            contact.email = req.body.email;
            contact.save(function (err) {
                if (!err)
                    res.send({ success: 'Contact updated with success' });
            });
        }
    });
};
