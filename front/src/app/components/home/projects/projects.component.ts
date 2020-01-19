import { Component, OnInit } from '@angular/core';
import { ProjetService } from 'src/app/services/project.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {

  public projects = [];

  constructor(private projectService: ProjetService) { }

  model = {
    name: '',
    description: ''
  };

  ngOnInit() {
    this.getProjects();
  }

  /**
   * Get all the projects info.
   */
  getProjects() {
    this.projectService.getProjects().subscribe(data => this.projects = data);
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


}
