import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notes } from 'src/app/models/notes.model';
import { NotesService } from 'src/app/services/notes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  public projectId;

  public noteId;
  public note: Notes;
  public notes = new Array<Notes>();

  constructor(private route: ActivatedRoute, 
              public notesService: NotesService, 
              public modalService: NgbModal) { }
  @ViewChild('popupUpdateNote', {static: false}) popupUpdateNote;

  model = {
    title: '',
    description: ''
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params[('id')];
      this.noteId = params[('noteid')];
    });
    this.getNotes();
    if(this.noteId != null) {
      this.getNote();
    }
  }

  getNote() {
    this.notesService.getNoteById(this.projectId, this.noteId)
        .subscribe(data => {
          this.note = data;
          this.model.title = this.note.title;
          this.model.description = this.note.description;
        });
  }

  getNotes() {
    this.notesService.getNotes(this.projectId).subscribe(
      data => this.notes = data['notes']);
  }

  onAddSubmit(form: NgForm) {
    this.notesService.addNote(this.projectId, form.value).subscribe(
      res => {
        console.log(res);
        this.getNotes();
      },
      err => {
        console.log(err);
      }
    );
  }

  onUpdateSubmit(form: NgForm) {
    this.notesService.updateNote(this.projectId, this.noteId, form.value).subscribe(
      res => {
        console.log(res);
        this.getNotes();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Delete the selected Note by id.
   */
  deleteNote(id) {
    console.log("Delete request");
    this.notesService.deleteNote(this.projectId, id).subscribe(
      res => {
        console.log(res);
        this.getNotes();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Update the selected Note by id.
   */
  updateNote(id) {
    console.log("Update request");
    this.noteId = id;
    this.notesService.getNoteById(this.projectId, this.noteId)
        .subscribe(data => {
          this.note = data;
          this.model.title = this.note.title;
          this.model.description = this.note.description;
          this.modalService.open(this.popupUpdateNote, { centered: true });
        });
  }

}
