import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from 'src/app/services/projet.service';
import { Project } from 'src/app/models/project.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit, AfterViewInit {
  @ViewChild('popupRepository', {static: false}) popupRepository;

  public projectId;
  public githubRepository;

  constructor(private route: ActivatedRoute,
              public projectService: ProjetService,
              public modalService: NgbModal) { }

  model = { githubRepository: ''};


  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getProjectRepo();
  }

  ngAfterViewInit(){
    this.openModal();
  }

  getProjectRepo() {
    this.projectService.getProjectById(this.projectId).subscribe(data => this.githubRepository = data.githubRepository);
  }

  openModal() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      this.githubRepository = data.githubRepository;
      if(this.githubRepository == undefined){
        this.modalService.open(this.popupRepository, { centered: true });
      }
    });
  }

  onSubmit(form: NgForm) {
        this.projectService.updateProjectGithub(this.projectId, form.value).subscribe(
          res => {
            this.getProjectRepo();
          },
          err => {
            console.log(err);
          }
        );
  }
}
