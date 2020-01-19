import { ProjetService } from './project.service';
import { AuthService } from './auth.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service, http, backend;
  let authService, authHttp, authBackend;
  let project: Project = {
    name: "projectTestName",
    description: "projectTestDesc",
    githubRepository: "projectTestGithubRepository",
    discord: "projectTestDiscord",
    trello: "projectTestTrello"
  }
  let user: User = {
    name: 'testingAcount',
    email: 'testingAcount@test.test',
    password: 'testingAcount'
  }
  let loginUser = {
    email: 'testingAcount@test.test',
    password: 'testingAcount'
  }
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProjetService]
  }));
  
  beforeEach(inject([ProjetService, HttpClient, HttpTestingController], (
    conf: ProjetService,
    _h: HttpClient,
    _b: HttpTestingController
  ) => {
    service = conf;
    http = _h;
    backend = _b;
  }));

  beforeEach(inject([AuthService, HttpClient, HttpTestingController], (
    conf: AuthService,
    _h: HttpClient,
    _b: HttpTestingController
  ) => {
    authService = conf;
    authHttp = _h;
    authBackend = _b;
  }));

  it('should be created', () => {
    const service: ProjetService = TestBed.get(ProjetService);
    expect(service).toBeTruthy();
  });

  it('should get projects', () => {
    let projectGet;
    authService.addUser(user).subscribe(
      res => {
        authService.login(loginUser).subscribe(
          res => {
          service.addProject(project).subscribe(
            res => {
            service.getProjects().subscribe(result => {
              console.log(result)
              if(result){
                projectGet = result[0].name
              }
            })
          })
        })
    })

    //expect(projectGet).toBe("projectTestName");
 
    const req = authBackend.expectOne({
        url: environment.API_URL+'/user',
        method: 'POST'
    });
 
    req.flush("", { status: 200, statusText: 'ok' });

    const req2 = authBackend.expectOne({
        url: environment.API_URL+'/user/login',
        method: 'POST'
    });

    req2.flush("", { status: 200, statusText: 'ok' });

    const req3 = backend.expectOne({
        url: environment.API_URL+'/project',
        method: 'POST'
    });

    req3.flush("", { status: 200, statusText: 'ok' });

    const req4 = backend.expectOne({
      url: environment.API_URL+'/project',
      method: 'GET'
    });

    req4.flush("", { status: 200, statusText: 'ok' });
 
});

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));

});