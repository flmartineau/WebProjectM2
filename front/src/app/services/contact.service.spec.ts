import { TestBed, inject } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';
import { ContactService } from './contact.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/contact.model';

describe('ContactService', () => {
  let service, http, backend;
  let projectService, projectHttp, projectBackend;

  let project = {
    name: "projectTestName",
    description: "projectTestDesc",
    githubRepository: "projectTestGithubRepository",
    discord: "projectTestDiscord",
    trello: "projectTestTrello",
    _id: "01234"
  }

  let contact: Contact = {
    firstName: "contactTestFirstName",
    lastName: "contactTestLastName",
    email: "contactTest@Email.com"
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [ContactService]
  }));
  
  beforeEach(inject([ContactService, HttpClient, HttpTestingController], (
    conf: ContactService,
    _h: HttpClient,
    _b: HttpTestingController
  ) => {
    service = conf;
    http = _h;
    backend = _b;
  }));

  beforeEach(inject([ProjectService, HttpClient, HttpTestingController], (
    conf: ProjectService,
    _h: HttpClient,
    _b: HttpTestingController
  ) => {
    projectService = conf;
    projectHttp = _h;
    projectBackend = _b;
  }));
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and get contacts', () => {
    let id = project._id;
    projectService.addProject(project).subscribe(res => {
      projectService.getOwnedProjects().subscribe(result =>{
        expect(result.name).toBe("projectTestName");
        service.addContact(id, contact).subscribe(res =>{
          service.getContacts(id).subscribe(contactRes => {
            expect(contactRes.email).toBe("contactTest@Email.com");
          })
        })
      })
    })


    const req = projectBackend.expectOne({
      url: environment.API_URL+'/project',
      method: 'POST'
    });
    req.flush(project, { status: 200, statusText: 'ok' });

    const req2 = projectBackend.expectOne({
      url: environment.API_URL+'/project/owned',
      method: 'GET'
    });
    req2.flush(project, { status: 200, statusText: 'ok' });

    const req3 = backend.expectOne({
      url: environment.API_URL+'/project/' + id + '/contacts',
      method: 'POST'
    });

    req3.flush(contact, { status: 200, statusText: 'ok' });

    const req4 = backend.expectOne({
      url: environment.API_URL+'/project/' + id + '/contacts',
      method: 'GET'
    });
    req4.flush(contact, { status: 200, statusText: 'ok' });
    
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));
});
