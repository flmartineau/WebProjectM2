import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ProjetService } from 'src/app/services/projet.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  public projectId;
  public project: Project;


  constructor(private route: ActivatedRoute, public projectService: ProjetService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getProject();
  }


  getProject() {
    this.projectService.getProjectById(this.projectId)
        .subscribe(data => {this.project = data; console.log(data)});
  }

}
