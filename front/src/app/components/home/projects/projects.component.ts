import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { NgForm } from '@angular/forms';
import { InvitationService } from 'src/app/services/invitation.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {

  public projects = [];
  public invitations = [];

  constructor(private projectService: ProjectService, public invitationService: InvitationService) { }

  model = {
    name: '',
    description: ''
  };

  ngOnInit() {
    this.getProjects();
    this.getInvitations();
  }

  /**
   * Get all the projects info.
   */
  getProjects() {
    this.projectService.getProjects().subscribe(data => this.projects = data);
  }

   /**
   * Get all the invitations info.
   */
  getInvitations() {
    this.invitationService.getInvitations().subscribe(data => { this.invitations = data; console.log(data);} );
  }

  /**
   * Delete a project from id.
   * @param id id of the project to delete.
   */
  deleteProject(id) {
    this.projectService.deleteProject(id).subscribe(data => this.getProjects());
  }

  onSubmit(form: NgForm) {
    this.projectService.addProject(form.value).subscribe(
      res => {
        this.getProjects();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * accept an invitation to a project.
   * @param invitationId id of the project to accept.
   */
  acceptInvitation(projectId) {
    this.invitationService.acceptInvitation(projectId)
      .subscribe(
        res => {
          this.getProjects();
          this.getInvitations();
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

  /**
   * Deny an invitation to a project.
   * @param invitationId id of the project to deny.
   */
  denyInvitation(projectId) {
    this.invitationService.denyInvitation(projectId)
      .subscribe(
        res => {
          this.getProjects();
          this.getInvitations();
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }


}
