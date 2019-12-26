import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ProjetService } from 'src/app/services/projet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  public projectId;
  public project: Project;


  constructor(private route: ActivatedRoute, public projectService: ProjetService, public modalService: NgbModal) { }
  @ViewChild('popupUpdateProject', {static: false}) popupUpdateProject;

  model = {
    name: '',
    description: ''
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getProject();
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

  openModal() {
    this.modalService.open(this.popupUpdateProject, { centered: true });
  }

  onSubmit(form: NgForm) {
    console.log("test")
  }

}
