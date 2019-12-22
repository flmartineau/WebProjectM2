import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User = {
    name: '',
    email: '',
    password: ''
  }

  constructor(private http: HttpClient) { }

  /**
   * Add a new user.
   * @param user user to add.
   */
  addUser(user: User) {
    return this.http.post(environment.API_URL+'/user', user);
  }

  /**
   * Login user from info.
   * @param infos info from the login form.
   */
  login(infos) {
    return this.http.post(environment.API_URL+'/user/login', infos);
  }
}
