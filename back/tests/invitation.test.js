let User = require('../models/user');
let Project = require('../models/project');
let Invitation = require('../models/invitation');
let Member = require('../models/member');

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
const userName2 = 'TestNameTwo';
const userEmail2 = 'testemailtwo@test.fr';
const userPassword2 = 'testtesttest';

const user1_register_details = {
    'name': userName,
    'email': userEmail,
    'password': userPassword
};

const user1_login_details = {
    'email': userEmail,
    'password': userPassword
};

let user1 = {
    'userId': '',
};
let user2 = {
    'userId': '',
};
let project1 = {
    'projectId': '',
};

const user2_register_details = {
    'name': userName2,
    'email': userEmail2,
    'password': userPassword2
};

const user2_login_details = {
    'email': userEmail2,
    'password': userPassword2
};

const project_details = {
    'name': 'ProjectTest',
    'description': 'ProjectDescription',
    'owner': ''
}

describe('Invitation: add, get, update, delete', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        Invitation.deleteMany({}, (err) => { });
        //On ajoute le 1er user
        chai.request(app)
            .post("/api/user")
            .send(user1_register_details)
            .end((err, res) => {
                res.should.have.status(200);
                
                //On ajoute le 2nd user
                chai.request(app)
                    .post("/api/user")
                    .send(user2_register_details)
                    .end((err, res) => {
                        res.should.have.status(200);

                         //On se connecte en tant que user 1 pour avoir son id
                         chai.request(app)
                            .post("/api/user/login")
                            .send(user1_login_details)
                            .end((err, res) => {
                                let token = res.body.token;

                                chai.request(app)
                                    .get("/api/user")
                                    .set('cookie', "token=" + token)
                                    .end((err, res) => {
                                        res.should.have.status(200); 
                                        user1.userId = res. body._id; 
                                        
                                        //On ajoute un projet
                                        chai.request(app)
                                            .post("/api/project")
                                            .set('cookie', "token=" + token)
                                            .send(project_details)
                                            .end((err, res) => {
                                                res.should.have.status(201);
                                                
                                                //On recupere le projet pour avoir son id
                                                chai.request(app)
                                                    .get("/api/project/owned")
                                                    .set('cookie', "token=" + token)
                                                    .end((err, res) => {
                                                        res.should.have.status(200);
                                                        project1.projectId = res.body[0]._id;
                                                        
                                                        //On se connecte en tant que user 2 pour avoir son id
                                                        chai.request(app)
                                                            .post("/api/user/login")
                                                            .send(user2_login_details)
                                                            .end((err, res) => {
                                                                let token = res.body.token;

                                                                chai.request(app)
                                                                    .get("/api/user")
                                                                    .set('cookie', "token=" + token)
                                                                    .end((err, res) => {
                                                                        res.should.have.status(200); 
                                                                        user2.userId = res. body._id; 
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

    after((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        Invitation.deleteMany({}, (err) => { done(); });
    });

    describe('/GET /POST /DELETE Invitations', () => {

        it('it should get invitation,add one and deny it', (done) => {
            //On se connecte en tant que user 1
            chai.request(app)
                .post("/api/user/login")
                .send(user1_login_details)
                .end((err, res) => {
                    let token = res.body.token;
                    
                    //On recupere les invitations de user 1
                    chai.request(app)
                        .get("/api/user/invitations")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);

                            expect(res.body.length).to.equal(0);
                            //On ajoute une invitation a user 2
                            chai.request(app)
                                .post("/api/project/" + project1.projectId + "/invitation")
                                .set('cookie', "token=" + token)
                                .send(user2)
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    
                                    //On se connecte en tant que user 2
                                    chai.request(app)
                                        .post("/api/user/login")
                                        .send(user2_login_details)
                                        .end((err, res) => {
                                            let token = res.body.token;
                                            
                                            //On recupere les invitations de user 2
                                            chai.request(app)
                                                .get("/api/user/invitations")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.length).to.equal(1);

                                                    //On decline l'invitation de user 2
                                                    chai.request(app)
                                                        .get("/api/project/" + project1.projectId + "/invitation/deny")
                                                        .set('cookie', "token=" + token)
                                                        .end((err, res) => {
                                                            res.should.have.status(201);
                                                            
                                                            //On recupere les invitations de user 2
                                                            chai.request(app)
                                                                .get("/api/user/invitations")
                                                                .set('cookie', "token=" + token)
                                                                .end((err, res) => {
                                                                    res.should.have.status(200);
                                                                    expect(res.body.length).to.equal(0);
                                                                    done();
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should get invitation and add one', (done) => {
            //On se connecte en tant que user 1
            chai.request(app)
                .post("/api/user/login")
                .send(user1_login_details)
                .end((err, res) => {
                    let token = res.body.token;
                    
                    //On recupere les invitations de user 1
                    chai.request(app)
                        .get("/api/user/invitations")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);

                            expect(res.body.length).to.equal(0);
                            //On ajoute une invitation a user 2
                            chai.request(app)
                                .post("/api/project/" + project1.projectId + "/invitation")
                                .set('cookie', "token=" + token)
                                .send(user2)
                                .end((err, res) => {
                                    res.should.have.status(201);
                                    
                                    //On se connecte en tant que user 2
                                    chai.request(app)
                                        .post("/api/user/login")
                                        .send(user2_login_details)
                                        .end((err, res) => {
                                            let token = res.body.token;
                                            
                                            //On recupere les invitations de user 2
                                            chai.request(app)
                                                .get("/api/user/invitations")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    expect(res.body.length).to.equal(1);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });

        it('it should accept invitation and become a Member', (done) => {
            //On se connecte en tant que user 2
            chai.request(app)
                .post("/api/user/login")
                .send(user2_login_details)
                .end((err, res) => {
                    let token = res.body.token;

                    //On recupere la liste des membres du projet
                    chai.request(app)
                        .get("/api/project/" + project1.projectId + "/members")
                        .set('cookie', "token=" + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let memberList = res.body.length;
                    
                            //On accept l'invitation de user 2
                            chai.request(app)
                                .get("/api/project/" + project1.projectId + "/invitation/accept")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(201);
           
                                    //On recupere les invitations de user 2
                                    chai.request(app)
                                        .get("/api/user/invitations")
                                        .set('cookie', "token=" + token)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            expect(res.body.length).to.equal(0);

                                            //On recupere la liste des membres du projet
                                            chai.request(app)
                                                .get("/api/project/" + project1.projectId + "/members")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    
                                                    expect(res.body.length).to.equal(memberList + 1);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });


    });   
     

});
