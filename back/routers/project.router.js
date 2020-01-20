const express = require('express');
const router = express.Router();

const projectController = require('../controllers/project.controller');
const agendaController = require('../controllers/agenda.controller');
const discordController = require('../controllers/discord.controller');
const trelloController = require('../controllers/trello.controller');
const contactController = require('../controllers/contact.controller');
const noteController = require('../controllers/note.controller');
const invitationController = require('../controllers/invitation.controller');

router.post('', projectController.addProject);
router.get('/owned', projectController.getOwnProjects);
router.get('/joined', projectController.getJoinedProjects);
router.put('/:projectId', projectController.updateProject);
router.get('/:projectId',projectController.getProjectById);
router.delete('/:projectId', projectController.deleteProject);

router.put('/:projectId/github', projectController.updateProjectGithub);

router.post('/:projectId/agenda', agendaController.addEvent);
router.get('/:projectId/agenda/:eventId', agendaController.getEventById);
router.put('/:projectId/agenda/:eventId', agendaController.updateEvent);
router.delete('/:projectId/agenda/:eventId', agendaController.deleteEvent);
router.get('/:projectId/agenda', agendaController.getAllEvents);
router.get('/:projectId/agenda/:year/:month', agendaController.getEventsByYearMonth);

router.put('/:projectId/discord', discordController.updateDiscord);

router.put('/:projectId/trello', trelloController.updateTrello);

router.post('/:projectId/contacts', contactController.addContact);
router.get('/:projectId/contacts', contactController.getContacts);
router.get('/:projectId/contacts/:contactId', contactController.getContact);
router.put('/:projectId/contacts/:contactId', contactController.updateContact);
router.delete('/:projectId/contacts/:contactId', contactController.deleteContact);

router.post('/:projectId/notes', noteController.addNote);
router.get('/:projectId/notes', noteController.getNotes);
router.get('/:projectId/notes/:noteId', noteController.getNote);
router.put('/:projectId/notes/:noteId', noteController.updateNote);
router.delete('/:projectId/notes/:noteId', noteController.deleteNote);

router.get('/:projectId/members', projectController.getMembers);

router.post('/:projectId/invitation', invitationController.invitUserToProject);
router.get('/:projectId/invitation/deny', invitationController.denyInvitation);
router.get('/:projectId/invitation/accept', invitationController.acceptInvitation);

module.exports = router;
