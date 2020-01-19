let User = require('../models/user');
let Project = require('../models/project');
let AgendaEvent = require('../models/agendaEvent');

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

const agenda_details = {
    'name': 'AgendaTest',
    'description': 'AgendaDescription',
    'date': new Date()
}

const new_agenda_details = {
    'name': 'AgendaTestUpdate',
    'description': 'AgendaDescriptionUpdate',
    'date': new Date("2000-01-01")
}

describe('Get agenda test, add a agenda', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        AgendaEvent.deleteMany({}, (err) => { });
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
        AgendaEvent.deleteMany({}, (err) => { done() });
    });

    describe('/GET /POST Agendas', () => {

        it('it should get agendas and add one new agenda', (done) => {
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
                            
                            //On recupere la liste des evennements pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/agenda")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des evennements pour le specifique projets
                                    let nb_agendas = res.body.events.length;

                                    //On ajoute un evennement pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/agenda")
                                        .set('cookie', "token=" + token)
                                        .send(agenda_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des evennements pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/agenda")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.events.length).to.equal(nb_agendas + 1);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should update agendas', (done) => {
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
                            
                            //On recupere la liste des evennements pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/agenda")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des evennements pour le specifique projets
                                    let nb_agendas = res.body.events.length;

                                    //On ajoute un evennement pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/agenda")
                                        .set('cookie', "token=" + token)
                                        .send(agenda_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des evennements pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/agenda")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.events.length).to.equal(nb_agendas + 1);
                                                    let events = res.body.events;
                                                    //On update
                                                    chai.request(app)
                                                        .put("/api/project/" + firstProject._id + "/agenda/" + res.body.events[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_agenda_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(204);
                                                            expect(events[0].name).to.not.equal(new_agenda_details.name);
                                                            expect(events[0].description).to.not.equal(new_agenda_details.description);
                                                            expect(events[0].date).to.not.equal(new_agenda_details.date);
                                                            
                                                            done();

                                                        });

                                                });
                                        });
                                });
                        });
                });
        });

        it('it should delete agendas', (done) => {
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
                            
                            //On recupere la liste des evennements pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/agenda")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des evennements pour le specifique projets
                                    let nb_agendas = res.body.events.length;

                                    //On ajoute un evennement pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/agenda")
                                        .set('cookie', "token=" + token)
                                        .send(agenda_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des evennements pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/agenda")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.events.length).to.equal(nb_agendas + 1);
                                                    let events = res.body.events;
                                                    ++nb_agendas;

                                                    //On delete
                                                    chai.request(app)
                                                        .delete("/api/project/" + firstProject._id + "/agenda/" + res.body.events[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_agenda_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(200);

                                                            //On recupere une 2nd fois la liste des evennements pour le specifique projets
                                                            chai.request(app)
                                                                .get("/api/project/" + firstProject._id + "/agenda")
                                                                .set('cookie', "token=" + token)
                                                                .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    expect(res.body.events.length).to.equal(nb_agendas - 1);
                                                                
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
