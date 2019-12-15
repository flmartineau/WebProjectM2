import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

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

  addUser(user: User) {
    return this.http.post('http://localhost:3002/api/user', user);
  }

  login(infos) {
    return this.http.post('http://localhost:3002/api/user/login', infos);
  }
}
