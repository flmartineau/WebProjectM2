import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the owned projects list.
   */
  getOwnedProjects(): Observable<Project[]>{
    return this.httpClient.get<Project[]>(environment.API_URL+'/project/owned');
  }

  /**
   * Get the joined projects list.
   */
  getJoinedProjects(): Observable<Project[]>{
    return this.httpClient.get<Project[]>(environment.API_URL+'/project/joined');
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
   * Update the discord Reference to the project
   * @param id id of the project
   * @param discordRef new Discord Reference for the project.
   */
  updateProjectDiscord(id, discordRef) {
    return this.httpClient.put(environment.API_URL+'/project/'+ id + '/discord', discordRef);
  }

  /**
   * Update the trello Reference to the project
   * @param id id of the project
   * @param trelloRef new Trello reference of the project
   */
  updateProjectTrello(id, trelloRef) {
    return this.httpClient.put(environment.API_URL+'/project/'+ id + '/trello', trelloRef);
  }


  /**
   * Get all the members to the project
   * @param id id of the project
   */
  getProjectMembers(id) : Observable<Member[]>{
    return this.httpClient.get<Member[]>(environment.API_URL+'/project/'+ id + '/members');
  }









}
