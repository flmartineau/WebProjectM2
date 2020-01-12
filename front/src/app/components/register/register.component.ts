import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  errorMessage: string;
  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.addUser(form.value).subscribe(
      res => {
        this.router.navigateByUrl('/login');
      },
      err => {
        this.errorMessage = err.error[0];
      }
    );
  }
}
