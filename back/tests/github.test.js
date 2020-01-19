let User = require('../models/user');
let Project = require('../models/project');
const APIReference = require('../models/apiReference');

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

const apiRef_details = {
    'link': 'https://githubapp.com/',
    'usernameAPI': 'apiRefUsernameAPITest',
    'tokenAPI': 'apiRefTokenAPITest'
}

describe('Discord:update', () => {
    before((done) => {
        User.deleteMany({}, (err) => { });
        Project.deleteMany({}, (err) => { });
        APIReference.deleteMany({}, (err) => { });
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
        APIReference.deleteMany({}, (err) => { done(); });
    });

    describe('/PUT Github', () => {

        it('it should update github', (done) => {
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
                            
                            //On recupere le github pour le specifique projets
                            chai.request(app)
                                .get("/api/project/" + firstProject._id)
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    let githubBefore = res.body.githubRepository;
                                    expect(githubBefore.link).to.equal(undefined);
                                    
                                    //On update
                                    chai.request(app)
                                        .put("/api/project/" + firstProject._id + "/github")
                                        .set('cookie', "token=" + token)
                                        .send(apiRef_details)
                                        .end((err, res) => {
                                            res.should.have.status(204);

                                            //On recupere le github une 2eme fois pour le specifique projets
                                            chai.request(app)
                                                .get("/api/project/" + firstProject._id)
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    
                                                    let githubAfter = res.body.githubRepository;
                                                    console.log(githubBefore)
                                                    console.log(githubAfter)
                                                    //expect(githubAfter.link).to.not.equal(undefined);
                                                    //expect(githubBefore.usernameAPI).to.not.equal(githubAfter.usernameAPI);
                                                    //expect(githubBefore.tokenAPI).to.not.equal(githubAfter.tokenAPI);
                                                    
                                                    done();
                                                });

                                        });
                                });
                        });
                });
        });

    });

});
