import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(public authService : AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout().subscribe(
      res => {
        localStorage.removeItem('userinfos');
        this.router.navigate(['login']);
      },
      err => { }
    );
  }

}
