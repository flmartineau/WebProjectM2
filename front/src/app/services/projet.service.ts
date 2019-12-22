import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the projects list.
   */
  getProjects(): Observable<Project[]>{
    return this.httpClient.get<Project[]>(environment.API_URL+'/project');
  }

  /**
   * Add a new project.
   * @param project project to be added.
   */
  addProject(project) {
    return this.httpClient.post(environment.API_URL+'/project', project);
  }

  /**
   * Delete a project from its id.
   * @param id id of the project to delete.
   */
  deleteProject(id) {
    return this.httpClient.delete(environment.API_URL+'/project/' + id);
  }

  /**
   * Get a project from its id.
   * @param id id of the project to get.
   */
  getProjectById(id) {
    return this.httpClient.get<Project>(environment.API_URL+'/project/' + id);
  }

  /**
   * Update a project by id.
   * @param id id of the project to update.
   * @param project updated project details.
   */
  updateProject(id, project) {
    return this.httpClient.put(environment.API_URL+'/project/' + id, project);
  }

  /**
   * Update the Github Reference of the project.
   * @param id id of the project.
   * @param githubRef new GitHub Reference for the project.
   */
  updateProjectGithub(id, githubRef) {
    return this.httpClient.put(environment.API_URL+'/project/' + id + '/github', githubRef);
  }

    /**
   * Add a Github Reference to the project.
   * @param id id of the project.
   * @param githubRef new GitHub Reference for the project.
   */
  addProjectGithub(id, githubRef) {
    return this.httpClient.post(environment.API_URL+'/project/' + id + '/github', githubRef);
  }

}
