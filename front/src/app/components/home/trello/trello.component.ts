import { Component, OnInit, ViewChild } from '@angular/core';
import { TrelloService } from 'src/app/services/trello.service';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjetService } from 'src/app/services/projet.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit {
  @ViewChild('popupTrello', {static: false}) popupTrello;

  public trelloRef;
  public trelloKey;
  public trelloToken;
  public trelloBoardId;

  public trelloName;
  public trelloLists;
  public trelloCards;

  public projectId;

  constructor(public trelloService : TrelloService,
              public modalService: NgbModal,
              public projectService: ProjetService,
              private route: ActivatedRoute) { }


  modelName = {
    trelloName: ''
  }

  model = {
    trelloKey: '',
    trelloToken: '',
    trelloBoardId: ''
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getTrelloBoard();
  }

  ngAfterViewInit(){
    this.openModal();
    this.getTrelloBoard();
  }


  /**
   * Get the trello board info.
   */
  getTrelloBoard() {
    this.projectService.getProjectById(this.projectId).subscribe(
      project => {
        if (project.trello.link != undefined) {
          this.trelloRef = project.trello;
          this.trelloKey = this.trelloRef.usernameAPI;
          this.trelloToken = this.trelloRef.tokenAPI;
          this.trelloBoardId = this.trelloRef.link;

          this.model.trelloBoardId = this.trelloBoardId;
          this.model.trelloKey = this.trelloKey;
          this.model.trelloToken = this.trelloToken;

          this.trelloService.getBoardFromId(this.trelloKey, this.trelloToken, this.trelloBoardId).subscribe(
            res => {
              console.log(res)
              this.trelloName = res['name'];
              this.modelName.trelloName = this.trelloName;

              this.trelloService.getLists(this.trelloKey, this.trelloToken, this.trelloBoardId).subscribe(
                lists => {
                  this.trelloLists = lists;
                  this.trelloService.getCards(this.trelloKey, this.trelloToken, this.trelloBoardId).subscribe(
                    cards => {
                      this.trelloCards = cards;
                    },
                    err3 => {
                      console.log(err3);
                    }
                  )
                },
                err2 => {
                  console.log(err2)
                }
              )
            },
            err => {
              console.log(err)
            }
          );
        }
      },
      err4 => {

      }
    )
  }

  /**
   * Open the Trello add form popup
   */
  openModal(){
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if(data.trello.link == undefined){
        this.modalService.open(this.popupTrello, {centered: true});
      }
    });
  }

  /**
   * Open the Trello edit form popup
   */
  openModalEdit(){
    this.modalService.open(this.popupTrello, {centered: true});
  }


  onSubmitEditName(form: NgForm){
    console.log(form.value)
    this.trelloService.updateName(this.trelloKey,this.trelloToken,this.trelloBoardId,form.value['trelloName']).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err)
      }
    )
  }

  onSubmit(form : NgForm){
    console.log(form.value)
    this.projectService.updateProjectTrello(this.projectId, form.value).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    )
  }




}
