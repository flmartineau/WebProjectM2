import { TestBed, inject } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AgendaEvent } from '../models/agendaEvent.model';
import { AgendaService } from './agenda.service';


describe('AgendaService', () => {
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

  let agendaEvent: AgendaEvent = {
    name: "agendaTestName",
    description: "agendaTestDesc",
    date: new Date("20/01/2020")
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [AgendaService]
  }));

  beforeEach(inject([AgendaService, HttpClient, HttpTestingController], (
    conf: AgendaService,
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
    const service: AgendaService = TestBed.get(AgendaService);
    expect(service).toBeTruthy();
  });

  it('should add and get agendaEvent', () => {
    let id = project._id;
    projectService.addProject(project).subscribe(res => {
      projectService.getOwnedProjects().subscribe(result =>{
        expect(result.name).toBe("projectTestName");
        service.addEvent(id, agendaEvent).subscribe(res =>{
          service.getEvents(id).subscribe(agendaEventRes => {
            expect(agendaEventRes.description).toBe("agendaTestDesc");
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
      url: environment.API_URL+'/project/' + id + '/agenda',
      method: 'POST'
    });

    req3.flush(agendaEvent, { status: 200, statusText: 'ok' });

    const req4 = backend.expectOne({
      url: environment.API_URL+'/project/' + id + '/agenda',
      method: 'GET'
    });
    req4.flush(agendaEvent, { status: 200, statusText: 'ok' });
    
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));

});
