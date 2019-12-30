import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaEvent } from '../models/agendaEvent.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the events list.
   * @param projectId id of the project
   */
  getEvents(projectId): Observable<AgendaEvent[]>{
    return this.httpClient.get<AgendaEvent[]>(environment.API_URL + '/projects/' + projectId + '/agenda');
  }

  /**
   * Add a new event.
   * @param projectId id of the project
   * @param event event to be added.
   */
  addEvent(projectId, event) {
    return this.httpClient.post(environment.API_URL + '/projects/' + projectId + '/agenda', event);
  }

  /**
   * Delete a event from its id.
   * @param projectId id of the project
   * @param id id of the event to delete.
   */
  deleteEvent(projectId, id) {
    return this.httpClient.delete(environment.API_URL + '/projects/' + projectId + '/agenda/' + id);
  }

  /**
   * Get a event from its id.
   * @param projectId id of the project
   * @param id id of the event to get.
   */
  getEventById(projectId, id) {
    return this.httpClient.get<AgendaEvent>(environment.API_URL + '/projects/' + projectId + '/agenda/' + id);
  }

  /**
   * Update a event by id.
   * @param projectId id of the project
   * @param id id of the event to update.
   * @param event updated event details.
   */
  updateEvent(projectId, id, event) {
    return this.httpClient.put(environment.API_URL + '/projects/' + projectId + '/agenda/' + id, event);
  }

}
