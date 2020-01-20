let User = require('../models/user');
let Project = require('../models/project');

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

const new_project_details = {
    'name': 'ProjectTestUpdate',
    'description': 'ProjectDescriptionUpdate',
    'owner': ''
}

describe('Projects: add, get, update, delete', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        chai.request(app)
            .post("/api/user")
            .send(register_details)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    after((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { done() });
    });

    describe('/GET /POST /PUT /DELETE Projects', () => {

        it('it should get projects and add one new project', (done) => {
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;
                    chai.request(app)
                        .get("/api/project/owned")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);

                            let nb_projects = res.body.length;

                            chai.request(app)
                                .post("/api/project")
                                .set('cookie', "token=" + token)
                                .send(project_details)
                                .end((err, res) => {
                                    res.should.have.status(201);

                                    chai.request(app)
                                        .get("/api/project/owned")
                                        .set('cookie', "token=" + token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            expect(res.body.length).to.equal(nb_projects + 1);
                                            done();
                                        });
                                });
                        });
                });
        });

        it('it should update project', (done) => {
            //On se connecte
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des projets
                    chai.request(app)
                        .get("/api/project/owned")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);

                            let nb_projects = res.body.length;
                            //On ajoute un projet
                            chai.request(app)
                                .post("/api/project")
                                .set('cookie', "token=" + token)
                                .send(project_details)
                                .end((err, res) => {
                                    res.should.have.status(201);

                                    //On recupere une 2nd fois la liste des projets
                                    chai.request(app)
                                        .get("/api/project/owned")
                                        .set('cookie', "token=" + token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            let projectsBeforeUpdate = res.body;
                                            expect(projectsBeforeUpdate.length).to.equal(nb_projects + 1);
                                            
                                            //On update
                                            chai.request(app)
                                                .put("/api/project/" + projectsBeforeUpdate[0]._id)
                                                .set('cookie', "token=" + token)
                                                .send(new_project_details)
                                                .end((err, res) => {
                                                    res.should.have.status(204);

                                                    //On recupere une 3eme fois la liste des projets
                                                    chai.request(app)
                                                        .get("/api/project/owned")
                                                        .set('cookie', "token=" + token)
                                                        .end((err, res) => {
                                                            res.should.have.status(200);
                                                            let projectsAfterUpdate = res.body;
                                                            expect(projectsBeforeUpdate[0]._id).to.equal(projectsAfterUpdate[0]._id);
                                                            expect(projectsBeforeUpdate[0].name).to.not.equal(projectsAfterUpdate[0].name);
                                                            expect(projectsBeforeUpdate[0].description).to.not.equal(projectsAfterUpdate[0].description);
                                                            
                                                            done();
                                                        });
                                                });
                                        });        
                                });
                            
                        });
                });
        });

        it('it should delete project', (done) => {
            //On se connecte
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des projets
                    chai.request(app)
                        .get("/api/project/owned")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            
                            //On recupere taille de la liste des projets
                            let nb_projects = res.body.length;
                            //On ajoute un projet
                            chai.request(app)
                                .post("/api/project")
                                .set('cookie', "token=" + token)
                                .send(project_details)
                                .end((err, res) => {
                                    res.should.have.status(201);

                                    //On recupere une 2nd fois la liste des des projets
                                    chai.request(app)
                                        .get("/api/project/owned")
                                        .set('cookie', "token=" + token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            let projectsBeforeUpdate = res.body;
                                            expect(projectsBeforeUpdate.length).to.equal(nb_projects + 1);
                                            ++nb_projects;
                                            
                                            //On delete
                                            chai.request(app)
                                                .delete("/api/project/" + projectsBeforeUpdate[0]._id)
                                                .set('cookie', "token=" + token)
                                                .send(new_project_details)
                                                .end((err, res) => {
                                                    res.should.have.status(200);

                                                    //On recupere une 3eme fois la liste des projets
                                                    chai.request(app)
                                                        .get("/api/project/owned")
                                                        .set('cookie', "token=" + token)
                                                        .end((err, res) => {
                                                            res.should.have.status(200);
                                                            expect(res.body.length).to.equal(nb_projects - 1);
                                                            
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
