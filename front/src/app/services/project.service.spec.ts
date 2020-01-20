import { ProjectService } from './project.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('ProjectService', () => {
  let service, http, backend;

  let project: Project = {
    name: "projectTestName",
    description: "projectTestDesc",
    githubRepository: "projectTestGithubRepository",
    discord: "projectTestDiscord",
    trello: "projectTestTrello"
  }

  let project2: Project = {
    name: "projectTestName2",
    description: "projectTestDesc",
    githubRepository: "projectTestGithubRepository",
    discord: "projectTestDiscord",
    trello: "projectTestTrello"
  }

  let project3: Object = {
    name: "projectTestName3",
    description: "projectTestDesc",
    githubRepository: "projectTestGithubRepository",
    discord: "projectTestDiscord",
    trello: "projectTestTrello",
    id: "01234"
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProjectService]
  }));
  
  beforeEach(inject([ProjectService, HttpClient, HttpTestingController], (
    conf: ProjectService,
    _h: HttpClient,
    _b: HttpTestingController
  ) => {
    service = conf;
    http = _h;
    backend = _b;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get projects', () => {
    service.getOwnedProjects().subscribe(result => {
      expect(result.name).toBe("projectTestName");
    })

    const req = backend.expectOne({
      url: environment.API_URL+'/project/owned',
      method: 'GET'
    });

    req.flush(project, { status: 200, statusText: 'ok' });
  });

  it('should add and get projects', () => {
    service.addProject(project2).subscribe(res => {
      service.getOwnedProjects().subscribe(result =>{
        expect(result.name).toBe("projectTestName2");
      })
    })

    const req = backend.expectOne({
      url: environment.API_URL+'/project',
      method: 'POST'
    });

    req.flush(project2, { status: 200, statusText: 'ok' });

    const req2 = backend.expectOne({
      url: environment.API_URL+'/project/owned',
      method: 'GET'
    });

    req2.flush(project2, { status: 200, statusText: 'ok' });
    
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));

});