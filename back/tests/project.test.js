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

describe('Get project test, add a project', () => {
    before((done) => {
        User.remove({}, (err) => { });
        Project.remove({}, (err) => { });
        chai.request(app)
            .post("/api/user")
            .send(register_details)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    after((done) => {
        User.remove({}, (err) => { });
        Project.remove({}, (err) => { done() });
    });

    describe('/GET /POST Projects', () => {

        it('it should get projects and add one new project', (done) => {
            chai.request(app)
                .post("/api/user/login")
                .send(login_details)
                .end((err, res) => {
                    let token = res.body.token;
                    chai.request(app)
                        .get("/api/project")
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
                                        .get("/api/project")
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
    });

});
