import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
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
  @ViewChild('popupRepositoryEdit', {static: false}) popupRepositoryEdit;

  public projectId;

  public githubRef;
  public githubOwner;
  public githubRepo;
  public githubUsername;
  public githubToken;

  public githubCommits;
  public commitDetails = [];

  public errorMessage;

  constructor(private route: ActivatedRoute,
              public projectService: ProjectService,
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

  ngOnDestroy(){
    this.modalService.dismissAll();
  }

  /**
   * Get the Github repository info.
   */
  getProjectRepo() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if (data.githubRepository.link != undefined) {
        this.githubRef = data.githubRepository;
        console.log(this.githubRef.link.split('/'));
        this.githubOwner = this.githubRef.link.split('/')[3];
        this.githubRepo = this.githubRef.link.split('/')[4];
        this.githubUsername = this.githubRef.usernameAPI;
        this.githubToken = this.githubRef.tokenAPI;

        this.model.githubLink = this.githubRef.link;
        this.model.githubToken = this.githubToken;
        this.model.githubUsername = this.githubUsername;

        this.githubService.getAllCommits(this.githubOwner, this.githubRepo, this.githubUsername, this.githubToken).subscribe(
          data => { this.githubCommits = data; this.errorMessage = ''},
          err => {
            if(err.status == '401'){
              this.errorMessage = "Github credentials are invalid, please check the repository URL or the login information"
            }
            else if(err.status == '404'){
              this.errorMessage = "Github repository not found. The repository may be private : please provide valid Github login credentials"
            } else {
              this.errorMessage = err.error.message;
            }
          });
      }
    });
  }

  /**
   * Open the Github URL add form popup.
   */
  openModal() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if(data.githubRepository.link == undefined){
        this.modalService.open(this.popupRepository, { centered: true });
      }
    });
  }

  /**
   * Open the Github URL edit form popup.
   */
  openModalEdit() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if(data.githubRepository.link == undefined){
        this.modalService.open(this.popupRepository, { centered: true });
      }
      else {
        this.modalService.open(this.popupRepositoryEdit, { centered: true });
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

  /**
   * Get details about a commit.
   * @param sha id of the commit.
   * @param index index of the commit details array.
   */
  getCommitDetails(sha, index){
    console.log(index)
    this.githubService.getCommitDetails(this.githubOwner, this.githubRepo, sha, this.githubUsername, this.githubToken).subscribe(
      data => {this.commitDetails[index] = data['files'];
      console.log(this.commitDetails[index])})
  }

}
