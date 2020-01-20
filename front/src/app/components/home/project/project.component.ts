import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
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


  constructor(private route: ActivatedRoute, public projectService: ProjectService, public modalService: NgbModal) { }
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

  openModal() {
    this.modalService.open(this.popupUpdateProject, { centered: true });
  }

  onSubmit(form: NgForm) {
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

}
