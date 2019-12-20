import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from 'src/app/services/projet.service';
import { Project } from 'src/app/models/project.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit, AfterViewInit {
  @ViewChild('popupRepository', {static: false}) popupRepository;

  public projectId;
  public githubRepository;

  public githubOwner;
  public githubRepo;


  public githubCommits;

  constructor(private route: ActivatedRoute,
              public projectService: ProjetService,
              public modalService: NgbModal,
              public githubService: GithubService) { }

  model = { githubRepository: ''};


  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
  }

  ngAfterViewInit(){
    this.openModal();
    this.getProjectRepo();
  }

  /**
   * Get the Github repository info.
   */
  getProjectRepo() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      this.githubRepository = data.githubRepository;
      console.log(this.githubRepository.split('/'));
      this.githubOwner = this.githubRepository.split('/')[3];
      this.githubRepo = this.githubRepository.split('/')[4];

      this.githubService.getAllCommits(this.githubOwner,this.githubRepo).subscribe(
        data => {this.githubCommits = data;
        console.log(data)})
    });

  }

  /**
   * Open the Github URL add form popup.
   */
  openModal() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      this.githubRepository = data.githubRepository;
      if(this.githubRepository == undefined){
        this.modalService.open(this.popupRepository, { centered: true });
      }
    });
  }

  /**
   * Open the Github URL edit form popup.
   */
  openModalEdit() {
    this.modalService.open(this.popupRepository, { centered: true });
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
