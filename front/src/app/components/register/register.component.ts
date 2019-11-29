import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  successmessage: boolean;
  errormessage: string;
  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.addUser(form.value).subscribe(
      res => {

      },
      err => {
        //affichage erreur
      }
    );
    console.log(form.value)
  }





}
