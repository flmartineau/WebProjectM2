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

const new_account_details = {
    'name': 'TestNameUpdated',
    'email': 'testemail@testupdate.fr',
    'password': userPassword
};

describe('Contact: add, get, update, delete', () => {
    before((done) => {
        User.deleteMany({}, (err) => { done(); });
    });

    after((done) => {
        User.deleteMany({}, (err) => { done(); });
    });

    describe('/GET /POST /PUT Users', () => {

        it('it should register user', (done) => {
            chai.request(app)
                .post("/api/user")
                .send(register_details)
                .end((err, res) => {
                    res.should.have.status(200);

                    User.deleteMany({}, (err) => { done(); });
                });
        });

        it('it should login, get and logout user', (done) => {
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
                            expect(token).to.not.equal(undefined);

                            //On recupere le user tout juste créer
                            chai.request(app)
                                .get("/api/user")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    let user = res.body;
                                    expect(user.name).to.equal(register_details.name);
                                    expect(user.email).to.equal(register_details.email);
                                    
                                    //On se deconnecte
                                    chai.request(app)
                                        .get("/api/user/logout")
                                        .end((err, res) => {
                                            res.should.have.status(200);

                                            User.deleteMany({}, (err) => { done(); });
                                        });
                                });
                        });
                });
        });

        it('it should update user', (done) => {
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
                            expect(token).to.not.equal(undefined);

                            //On recupere le user tout juste créer
                            chai.request(app)
                                .get("/api/user")
                                .set('cookie', "token=" + token)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    let userBefore = res.body;
                                    expect(userBefore.name).to.equal(register_details.name);
                                    expect(userBefore.email).to.equal(register_details.email);
                                    
                                    //On update le user
                                    chai.request(app)
                                        .put("/api/user")
                                        .set('cookie', "token=" + token)
                                        .send(new_account_details)
                                        .end((err, res) => {
                                            res.should.have.status(204);
                                            
                                            //On recupere le user une seconde fois
                                            chai.request(app)
                                                .get("/api/user")
                                                .set('cookie', "token=" + token)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    let userAfter = res.body;
                                                    expect(userBefore._id).to.equal(userAfter._id);
                                                    expect(userBefore.name).to.not.equal(userAfter.name);
                                                    expect(userBefore.email).to.not.equal(userAfter.email);
                                                    
                                                    //On se deconnecte
                                                    chai.request(app)
                                                        .get("/api/user/logout")
                                                        .end((err, res) => {
                                                            res.should.have.status(200);

                                                            User.deleteMany({}, (err) => { done(); });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });

    });

});
