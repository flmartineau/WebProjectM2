import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
   * Update the current logged user.
   * @param user updated user.
   */
  updateUser(user: User) {
    return this.http.put(environment.API_URL+'/user', user);
  }

  /**
   * Login user from info.
   * @param infos info from the login form.
   */
  login(infos) {
    return this.http.post(environment.API_URL+'/user/login', infos);
  }

  /**
   * Logout the current user.
   */
  logout() {
    return this.http.get(environment.API_URL + '/user/logout');
  }


  /**
   * Get current user.
   */
  getUser(){
    return this.http.get(environment.API_URL+ '/user');
  }

  /**
   * Get all users.
   */
  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.API_URL+ '/users');
  }

}
