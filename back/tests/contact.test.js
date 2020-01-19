let User = require('../models/user');
let Project = require('../models/project');
let Contact = require('../models/contact');

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

const contact_details = {
    'firstName': 'contactFirstName',
    'lastName': 'contactLastName',
    'email': 'contactEmail@test.test'
}

const new_contact_details = {
    'firstName': 'contactFirstNameUpdate',
    'lastName': 'contactLastNameUpdate',
    'email': 'contactEmailUpdate@test.test'
}

describe('Contact: add, get, update, delete', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        Contact.deleteMany({}, (err) => { });
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
        Contact.deleteMany({}, (err) => { done() });
    });

    describe('/GET /POST Agendas', () => {

        it('it should get contacts and add one new contact', (done) => {
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
                            
                            //On recupere la liste des contacts pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/contacts")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des contacts pour le specifique projets
                                    let nb_contacts = res.body.contacts.length;

                                    //On ajoute un contact pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/contacts")
                                        .set('cookie', "token=" + token)
                                        .send(contact_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des contacts pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/contacts")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.contacts.length).to.equal(nb_contacts + 1);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should update contacts', (done) => {
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
                            
                            //On recupere la liste des contacts pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/contacts")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des contacts pour le specifique projets
                                    let nb_contacts = res.body.contacts.length;

                                    //On ajoute un evennement pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/contacts")
                                        .set('cookie', "token=" + token)
                                        .send(contact_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des contacts pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/contacts")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    let contactsBeforeUpdate = res.body.contacts;
                                                    expect(contactsBeforeUpdate.length).to.equal(nb_contacts + 1);
                                                    //On update
                                                    chai.request(app)
                                                        .put("/api/project/" + firstProject._id + "/contacts/" + contactsBeforeUpdate[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_contact_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(204);

                                                            //On recupere une 3eme fois la liste des evennements pour le specifique projets
                                                            chai.request(app)
                                                                .get("/api/project/" + firstProject._id + "/contacts")
                                                                .set('cookie', "token=" + token)
                                                                .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    let contactsAfterUpdate = res.body.contacts;
                                                                    expect(contactsBeforeUpdate[0]._id).to.equal(contactsAfterUpdate[0]._id);
                                                                    expect(contactsBeforeUpdate[0].firstName).to.not.equal(contactsAfterUpdate[0].firstName);
                                                                    expect(contactsBeforeUpdate[0].lastName).to.not.equal(contactsAfterUpdate[0].lastName);
                                                                    expect(contactsBeforeUpdate[0].email).to.not.equal(contactsAfterUpdate[0].email);
                                                                    
                                                                    done();
                                                                });

                                                        });
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should delete contacts', (done) => {
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
                            
                            //On recupere la liste des contacts pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id + "/contacts")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    //On recupere taille de la liste des contacts pour le specifique projets
                                    let nb_contacts = res.body.contacts.length;

                                    //On ajoute un contact pour le specifique projets
                                    chai.request(app)
                                        .post("/api/project/" + firstProject._id + "/contacts")
                                        .set('cookie', "token=" + token)
                                        .send(contact_details)
                                        .end((err, res) => {
                                            res.should.have.status(201);

                                            //On recupere une 2nd fois la liste des contacts pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id + "/contacts")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.contacts.length).to.equal(nb_contacts + 1);
                                                    let contacts = res.body.contacts;
                                                    ++nb_contacts;

                                                    //On delete
                                                    chai.request(app)
                                                        .delete("/api/project/" + firstProject._id + "/contacts/" + res.body.contacts[0]._id)
                                                        .set('cookie', "token=" + token)
                                                        .send(new_contact_details)
                                                        .end((err, res) => {
                                                            res.should.have.status(200);

                                                            //On recupere une 2nd fois la liste des contacts pour le specifique projets
                                                            chai.request(app)
                                                                .get("/api/project/" + firstProject._id + "/contacts")
                                                                .set('cookie', "token=" + token)
                                                                .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    expect(res.body.contacts.length).to.equal(nb_contacts - 1);
                                                                
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
