import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notes } from '../models/notes.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get all notes.
   * @param projectId id of the project
   */

  getNotes(projectId): Observable<Notes[]>{
    return this.httpClient.get<Notes[]>(environment.API_URL + '/project/' + projectId + '/notes');
  }
  /**
   * Add a new note
   * @param projectId id of the project
   * @param note note to be added.
   */
  addNote(projectId, note) {
    return this.httpClient.post(environment.API_URL + '/project/' + projectId + '/notes', note);
  }

  /**
   * Delete one note.
   * @param projectId id of the project
   * @param id Id of the note to delete.
   */
  deleteNote(projectId, id) {
    return this.httpClient.delete(environment.API_URL + '/project/' + projectId + '/notes/' + id);
  }

  /**
   * Get one note by its id.*
   * @param projectId id of the project
   * @param id Id of the note to get.
   */
  getNoteById(projectId, id) {
    return this.httpClient.get<Notes>(environment.API_URL + '/project/' + projectId + '/notes/' + id);
  }

  /**
   * Update one note.
   * @param projectId id of the project
   * @param id id of the note to update.
   * @param note note used to update.
   */
  updateNote(projectId, id, note) {
    return this.httpClient.put(environment.API_URL + '/project/' + projectId + '/notes/' + id, note);
  }

}
