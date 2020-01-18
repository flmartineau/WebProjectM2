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
  @ViewChild('popupAddList', {static: false}) popupAddList;
  @ViewChild('popupEditList', {static: false}) popupEditList;

  public trelloRef;
  public trelloKey;
  public trelloToken;
  public trelloBoardUrl;
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

  modelCard = {
    cardName: '',
    cardDescription: ''
  }

  modelList = {
    listName: '',
    listId:''
  }

  model = {
    trelloKey: '',
    trelloToken: '',
    trelloBoardUrl: ''
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
          this.trelloBoardUrl = this.trelloRef.link;

          this.model.trelloBoardUrl = this.trelloBoardUrl;
          this.model.trelloKey = this.trelloKey;
          this.model.trelloToken = this.trelloToken;

          this.trelloService.getAllBoards(this.trelloKey, this.trelloToken).subscribe(
            boards => {
              for (let board in boards) {
                if (boards[board]['url'] == this.trelloBoardUrl) {
                  this.trelloBoardId = boards[board]['id'];
                }
              }

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
            },
            errorBoards => {
              console.log(errorBoards);
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
      console.log(data)
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


  /**
   * Submit the trello name edit form
   * @param form the name edit form
   */
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

  /**
   * Submit the add card form
   * @param form the card add form
   * @param id id of the list
   */
  onSubmitAddCard(form: NgForm, id){
    console.log(form.value, id)
    this.trelloService.addCardToList(this.trelloKey,this.trelloToken, id, form.value['cardName'], form.value['cardDescription']).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    )
  }

  /**
   * Submit the Trello reference edit form
   * @param form the Trello reference edit form
   */
  onSubmit(form : NgForm){
    this.projectService.updateProjectTrello(this.projectId, form.value).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    )
  }

  /**
   * Delete a card from the Trello board
   * @param id id of the card to delete
   */
  deleteCard(id) {
    this.trelloService.deleteCard(this.trelloKey,this.trelloToken, id).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    );
  }


  /**
   * Delete a list from the Trello board
   * @param id id of the list
   */
  deleteList(id) {
    this.trelloService.deleteList(this.trelloKey,this.trelloToken, id).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Open the add list popup
   */
  openModalAddList() {
    this.modalService.open(this.popupAddList, {centered: true});
  }

  /**
   * Submit the add list form
   * @param form the add list form
   */
  onSubmitAddList(form: NgForm){
    this.trelloService.addList(this.trelloKey,this.trelloToken,this.trelloBoardId,form.value['listName']).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Open the edit list form.
   */
  openModalEditList(id){
    this.modelList.listId = id;
    this.modalService.open(this.popupEditList, {centered: true});
  }

  /**
   * Submit the edit list form
   * @param form the edit list form
   */
  onSubmitEditList(form: NgForm){
    this.trelloService.updateListName(this.trelloKey,this.trelloToken,this.modelList.listId,form.value['listName']).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Move card to another list
   * @param idCard id of the card
   * @param idList id of the list
   */
  moveCardToList(idCard, idList){
    this.trelloService.moveCardToListFromId(this.trelloKey,this.trelloToken, idCard, idList).subscribe(
      res => {
        this.getTrelloBoard();
      },
      err => {
        console.log(err);
      }
    );
  }

}
