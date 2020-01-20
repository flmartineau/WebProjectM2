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
    const service: ProjectService = TestBed.get(ProjectService);
    expect(service).toBeTruthy();
  });

  it('should get projects', () => {
    const spyProjectService = jasmine.createSpyObj('spyProjectService', ['getProjects']);
    spyProjectService.getProjects.and.returnValue( Observable.create(project) );
    service.getProjects().subscribe(result => {
      expect(result.name).toBe("projectTestName");
    })

    const req = backend.expectOne({
      url: environment.API_URL+'/project',
      method: 'GET'
    });

    req.flush(project, { status: 200, statusText: 'ok' });
 
});

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));

});