import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  model = {
    name: '',
    email: '',
    password: ''
  };

  onSubmit(form: NgForm) {
    console.log(form.value)

    this.authService.updateUser(form.value).subscribe(
      res => {

      },
      err => {

      }
    );
}






}
