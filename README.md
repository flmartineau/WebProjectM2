Projet de programmation Web - Master 2
=============================================================

Groupe : GOURGUE Antoine - MARTINEAU Flavien - PEYRICHOU Arthur

**Description du projet**

Site de gestion de projets destiné à des étudiants/développeurs, permettant de gérer et de récupérer toutes les informations relatives à leurs projet. Le site servant ainsi de "hub" en regroupant :

- Les informations du dépôt GitHub (API GitHub) : données des commits, etc...
- Les outils de conversation (Discord)
- La gestion du projet avec Trello
- La gestion des contacts + prises de RDVs + dates importantes (Agenda)
- Ajout de notes diverses

Technologies utilisées
======================

- **Backend** : Node.js (Express)
- **Frontend** : Angular, Bootstrap
- **Base de données** : MongoDB


Configuration
=============

Pour lancer le front, aller dans le dossier /front et tapez :

`npm install`
`ng serve --open`


Pour demarrer la base de données MongoDB :

`docker-compose up -d mongodb`

Ensuite pour démarrer le back, dans le dossier /back :

`node app.js`

