import { TestBed, inject } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Notes } from '../models/notes.model';
import { NotesService } from './notes.service';

describe('NotesService', () => {
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

  let notes : Notes = {
    title: "notesTestTitle",
    description: "notesTestDesc"
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [NotesService]
  }));

  beforeEach(inject([NotesService, HttpClient, HttpTestingController], (
    conf: NotesService,
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
    const service: NotesService = TestBed.get(NotesService);
    expect(service).toBeTruthy();
  });

  it('should add and get notes', () => {
    let id = project._id;
    projectService.addProject(project).subscribe(res => {
      projectService.getOwnedProjects().subscribe(result =>{
        expect(result.name).toBe("projectTestName");
        service.addNote(id, notes).subscribe(res =>{
          service.getNotes(id).subscribe(notesRes => {
            expect(notesRes.title).toBe("notesTestTitle");
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
      url: environment.API_URL+'/project/' + id + '/notes',
      method: 'POST'
    });

    req3.flush(notes, { status: 200, statusText: 'ok' });

    const req4 = backend.expectOne({
      url: environment.API_URL+'/project/' + id + '/notes',
      method: 'GET'
    });
    req4.flush(notes, { status: 200, statusText: 'ok' });
    
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();   
  }));

});
