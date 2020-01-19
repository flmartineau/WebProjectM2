let User = require('../models/user');
let Project = require('../models/project');
let Note = require('../models/note');

process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHttp);

const userName = 'TestName';
const userEmail = 'testemail@test.fr';
const userPassword = 'testtest';

const register_details = {
    'name': userName,
    'email': userEmail,
    'password': userPassword
};

const login_details = {
    'email': userEmail,
    'password': userPassword
};

const project_details = {
    'name': 'ProjectTest',
    'description': 'ProjectDescription',
    'owner': ''
}

const note_details = {
    'title': 'noteTitle',
    'description': 'noteDescription'
}

const new_note_details = {
    'title': 'noteTitleUpdate',
    'description': 'noteDescriptionUpdate'
}

describe('Note: add, get, update, delete', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        Note.deleteMany({}, (err) => { });
        //On creer un compte
        chai.request(app)
            .post("/api/user")
            .send(register_details)
            .end((err, res) => {
                res.should.have.status(200);
                
                //On se connecte
                chai.request(app)
                    .post("/api/user/login")
                    .send(login_details)
                    .end((err, res) => {
                        let token = res.body.token;

                        //On creer un projet
                        chai.request(app)
                        .post("/api/project")
                        .set('cookie', "token=" + token)
                        .send(project_details)
                        .end((err, res) => {
                            res.should.have.status(201);
                            done();
                        });
                    });
            });
    });

    after((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        Note.deleteMany({}, (err) => { done() });
    });

    describe('/GET /POST Agendas', () => {

        it('it should get notes and add one new note', (done) => {
            //On se connecte
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des projets
                    chai.request(app)
                        .get("/api/project")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            //On prends le premier de la liste, celui creer dans le before
                            let firstProject = res.body[0];
                            
                            //On recupere la liste des notes pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/notes")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des notes pour le specifique projets
                                    let nb_notes = res.body.notes.length;

                                    //On ajoute un note pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/notes")
                                        .set('cookie', "token=" + token)
                                        .send(note_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des notes pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/notes")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.notes.length).to.equal(nb_notes + 1);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should update notes', (done) => {
            //On se connecte
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des projets
                    chai.request(app)
                        .get("/api/project")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            //On prends le premier de la liste, celui creer dans le before
                            let firstProject = res.body[0];
                            
                            //On recupere la liste des notes pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/notes")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des notes pour le specifique projets
                                    let nb_notes = res.body.notes.length;

                                    //On ajoute un evennement pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/notes")
                                        .set('cookie', "token=" + token)
                                        .send(note_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des notes pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/notes")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.notes.length).to.equal(nb_notes + 1);
                                                    let notes = res.body.notes;
                                                    //On update
                                                    chai.request(app)
                                                        .put("/api/project/" + firstProject._id + "/notes/" + res.body.notes[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_note_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(204);
                                                            expect(notes[0].title).to.not.equal(new_note_details.title);
                                                            expect(notes[0].description).to.not.equal(new_note_details.description);
                                                            
                                                            done();

                                                        });

                                                });
                                        });
                                });
                        });
                });
        });

        it('it should delete notes', (done) => {
            //On se connecte
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des projets
                    chai.request(app)
                        .get("/api/project")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            //On prends le premier de la liste, celui creer dans le before
                            let firstProject = res.body[0];
                            
                            //On recupere la liste des notes pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/notes")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des notes pour le specifique projets
                                    let nb_notes = res.body.notes.length;

                                    //On ajoute un note pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/notes")
                                        .set('cookie', "token=" + token)
                                        .send(note_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des notes pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/notes")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.notes.length).to.equal(nb_notes + 1);
                                                    let notes = res.body.notes;
                                                    ++nb_notes;

                                                    //On delete
                                                    chai.request(app)
                                                        .delete("/api/project/" + firstProject._id + "/notes/" + res.body.notes[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_note_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(200);

                                                            //On recupere une 2nd fois la liste des notes pour le specifique projets
                                                            chai.request(app)
                                                                .get("/api/project/" + firstProject._id + "/notes")
                                                                .set('cookie', "token=" + token)
                                                                .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    expect(res.body.notes.length).to.equal(nb_notes - 1);
                                                                
                                                                    done();

                                                                });

                                                        });

                                                });
                                        });
                                });
                        });
                });
        });

    });

});
