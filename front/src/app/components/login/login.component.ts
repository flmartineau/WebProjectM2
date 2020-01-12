import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthService, private router : Router) { }

  errorMessage: string;


  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value).subscribe(
      res => {
        this.router.navigateByUrl('/home/projects');
      },
      err => {
        console.log(err.error.message)
        this.errorMessage = err.error.message;
      }
    );
  }


}
