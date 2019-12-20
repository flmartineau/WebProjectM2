import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<Project[]>{
    return this.httpClient.get<Project[]>('http://localhost:3002/api/project');
  }


  addProject(project) {
    return this.httpClient.post('http://localhost:3002/api/project', project);
  }

  deleteProject(id) {
    return this.httpClient.delete('http://localhost:3002/api/project/' + id);
  }

  getProjectById(id) {
    return this.httpClient.get<Project>('http://localhost:3002/api/project/' + id);
  }

  updateProject(id, project) {
    return this.httpClient.put('http://localhost:3002/api/project/' + id, project);
  }

  updateProjectGithub(id, githubUrl) {
    return this.httpClient.put('http://localhost:3002/api/project/' + id + '/github', githubUrl);
  }

}
