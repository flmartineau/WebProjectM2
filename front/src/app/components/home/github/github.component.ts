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
  public githubRef;

  public githubOwner;
  public githubRepo;
  public githubUsername;
  public githubToken;


  public githubCommits;

  public commitDetails; //TODO : change to array to fix view bug

  constructor(private route: ActivatedRoute,
              public projectService: ProjetService,
              public modalService: NgbModal,
              public githubService: GithubService) { }

  model = {
    githubLink: '',
    githubUsername: '',
    githubToken: ''
  };


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
      if(data.githubRepository != undefined){
        this.githubRef = data.githubRepository;
        console.log(this.githubRef.link.split('/'));
        this.githubOwner = this.githubRef.link.split('/')[3];
        this.githubRepo = this.githubRef.link.split('/')[4];
        this.githubUsername = this.githubRef.usernameAPI;
        this.githubToken = this.githubRef.tokenAPI;

        this.githubService.getAllCommits(this.githubOwner,this.githubRepo, this.githubUsername, this.githubToken).subscribe(
          data => {this.githubCommits = data});
      }
    });

  }

  /**
   * Open the Github URL add form popup.
   */
  openModal() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if(data.githubRepository == undefined){
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
        console.log(form.value)
        this.projectService.addProjectGithub(this.projectId, form.value).subscribe(
          res => {
            this.getProjectRepo();
          },
          err => {
            console.log(err);
          }
        );
  }

  /**
   * Get details about a commit.
   * @param sha id of the commit.
   */
  getCommitDetails(sha){
    this.githubService.getCommitDetails(this.githubOwner, this.githubRepo, sha, this.githubUsername, this.githubToken).subscribe(
      data => {this.commitDetails = data['files'];
      console.log(this.commitDetails)})
  }

}
