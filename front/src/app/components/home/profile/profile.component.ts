import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  errorMessage;
  successMessage;

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(
      res => {
        console.log(res);
        this.model.name = res['name'];
        this.model.email = res['email'];
      },
      err => {
        console.log(err)
      }
    );

  }

  model = {
    name: '',
    email: '',
    password: ''
  };

  onSubmit(form: NgForm) {
    this.authService.updateUser(form.value).subscribe(
      res => {
        this.successMessage = "User modified with success";
        this.errorMessage = null;
      },
      err => {
        this.errorMessage = err.error;
        this.successMessage = null;
      }
    );
}






}
