import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the contacts list.
   * @param projectId id of the project
   */
  getContacts(projectId): Observable<Contact[]>{
    return this.httpClient.get<Contact[]>(environment.API_URL + '/project/' + projectId + '/contacts');
  }

  /**
   * Add a new contact.
   * @param projectId id of the project
   * @param contact contact to be added.
   */
  addContact(projectId, contact) {
    return this.httpClient.post(environment.API_URL + '/project/' + projectId + '/contacts', contact);
  }

  /**
   * Delete a contact from its id.
   * @param projectId id of the project
   * @param id id of the contact to delete.
   */
  deleteContact(projectId, id) {
    return this.httpClient.delete(environment.API_URL + '/project/' + projectId + '/contacts/' + id);
  }

  /**
   * Get a contact from its id.
   * @param projectId id of the project
   * @param id id of the contact to get.
   */
  getContactById(projectId, id) {
    return this.httpClient.get<Contact>(environment.API_URL + '/project/' + projectId + '/contacts/' + id);
  }

  /**
   * Update a contact by id.
   * @param projectId id of the project
   * @param id id of the contact to update.
   * @param contact updated contact details.
   */
  updateContact(projectId, id, contact) {
    return this.httpClient.put(environment.API_URL + '/project/' + projectId + '/contacts/' + id, contact);
  }

}
