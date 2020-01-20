import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Invitation } from '../models/invitation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Add a new invitation.
   * @param projectId project of the invitation.
   * @param invitation invitation to be added.
   */
  addInvitation(projectId, invitation) {
    return this.httpClient.post(environment.API_URL + '/project/' + projectId + '/invitation', invitation);
  }

  /**
   * accept a new invitation.
   * @param projectId project of the invitation.
   */
   acceptInvitation(projectId) {
    return this.httpClient.get(environment.API_URL + '/project/' + projectId + '/invitation/accept');
  }

  /**
   * deny a new invitation.
   * @param projectId project of the invitation.
   */
  denyInvitation(projectId) {
    return this.httpClient.get(environment.API_URL + '/project/' + projectId + '/invitation/deny');
  }

  /**
   * Get all invitations from current user.
   */
  getInvitations(): Observable<Invitation[]>{
    return this.httpClient.get<Invitation[]>(environment.API_URL + '/user/invitations');
  }

}
