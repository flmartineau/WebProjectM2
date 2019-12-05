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

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value).subscribe(
      res => {
        this.router.navigateByUrl('/home');
      },
      err => {
       
      }
    );
    console.log(form.value);
    this.router.navigateByUrl('/home');//tmp

  }


}
