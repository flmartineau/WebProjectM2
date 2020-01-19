import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'src/app/models/contact.model';
import { Project } from 'src/app/models/project.model';
import { ContactService } from 'src/app/services/contact.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public contactId;
  public contact: Contact;
  public contacts = new Array<Contact>();

  public projectId;
  public project: Project;

  constructor(private route: ActivatedRoute, public contactService: ContactService, public modalService: NgbModal) { }
  @ViewChild('popupUpdateContact', {static: false}) popupUpdateContact;

  model = {
    firstName: '',
    lastName: '',
    email: '',
  };

  ngOnInit()  {
    this.route.params.subscribe(params => {
      const idProject = 'id';
      this.projectId = params[idProject];
      const idContact = 'contactId';
      this.contactId = params[idContact];
    });

    this.getContacts();
    if(this.contactId != null) {
      this.getContact();
    }
  }

  ngOnDestroy(){
    this.modalService.dismissAll();
  }

  /**
   * Get the selected contact info.
   */
  getContact() {
    this.contactService.getContactById(this.projectId, this.contactId)
        .subscribe(data => {
          this.contact = data;
          this.model.firstName = this.contact.firstName;
          this.model.lastName = this.contact.lastName;
          this.model.email = this.contact.email;
        });
  }

  /**
   * Get all the contacts of a project.
   */
  getContacts() {
    this.contactService.getContacts(this.projectId).subscribe(data => this.contacts = data['contacts']);
  }

  onAddSubmit(form: NgForm) {
    console.log(form);
    this.contactService.addContact(this.projectId, form.value).subscribe(
      res => {
        console.log(res);
        this.getContacts();
      },
      err => {
        console.log(err);
      }
    );
  }

  onUpdateSubmit(form: NgForm) {
    console.log(form.value);
    this.contactService.updateContact(this.projectId, this.contactId,form.value).subscribe(
      res => {
        console.log(res);
        this.getContacts();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Delete the selected contact by id.
   */
  deleteContact(id) {
    console.log("Delete request");
    this.contactService.deleteContact(this.projectId, id).subscribe(
      res => {
        console.log(res);
        this.getContacts();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Update the selected contact by id.
   */
  updateContact(id) {
    console.log("Update request");
    this.contactId = id;
    this.contactService.getContactById(this.projectId, this.contactId)
        .subscribe(data => {
          this.contact = data;
          this.model.firstName = this.contact.firstName;
          this.model.lastName = this.contact.lastName;
          this.model.email = this.contact.email;
          this.modalService.open(this.popupUpdateContact, { centered: true });
        });
  }

}
