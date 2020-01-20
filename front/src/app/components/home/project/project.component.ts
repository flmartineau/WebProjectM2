import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { AuthService } from 'src/app/services/auth.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  public projectId;
  public project: Project;
  public users:User[] = [];


  constructor(private route: ActivatedRoute, public projectService: ProjectService, public authService: AuthService, public invitationService: InvitationService, public modalService: NgbModal) { }
  @ViewChild('popupUpdateProject', {static: false}) popupUpdateProject;
  @ViewChild('popupInvitation', {static: false}) popupInvitation;

  model = {
    name: '',
    description: ''
  };

  invitationModel = {
    userId:''
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getProject();
    this.getUsers();
  }

  ngOnDestroy(){
    this.modalService.dismissAll();
  }

  /**
   * Get the selected project info.
   */
  getProject() {
    this.projectService.getProjectById(this.projectId)
        .subscribe(data => {
          this.project = data;
          console.log(data);
          this.model.name = this.project.name;
          this.model.description = this.project.description;});
  }

  /**
   * Get all user
   */
  getUsers() {
    this.authService.getUsers()
        .subscribe(data => {
          this.users = [];
          data.forEach(element => {
            this.users.push(element);
          });
          console.log(this.users);
        });
  }


  openModalUpdate() {
    this.modalService.open(this.popupUpdateProject, { centered: true });
  }

  openModalInvitation() {
    this.modalService.open(this.popupInvitation, { centered: true });
  }

  onSubmitUpdate(form: NgForm) {
    console.log(form.value);
    this.projectService.updateProject(this.projectId,form.value).subscribe(
      res => {
        this.getProject();
      },
      err => {
        console.log(err);
      }
    );
  }

  onInvitationSubmit(form: NgForm) {
    console.log(form.value);
    this.invitationService.addInvitation(this.projectId, form.value).subscribe(
      res => {
        
      },
      err => {
        console.log(err);
      }
    );
  }

}