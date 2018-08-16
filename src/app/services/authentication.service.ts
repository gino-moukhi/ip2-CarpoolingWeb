import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginUser} from '../models/user/login-user';
import {RegisterUser} from '../models/user/register-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = 'http://localhost:8080/authentication';
  constructor(private http: HttpClient) { }

  login(loginUser: LoginUser) {
    return this.http.post<LoginUser>(this.baseUrl + '/signin', loginUser);
  }

  register(registerUser: RegisterUser) {
    return this.http.post<RegisterUser>(this.baseUrl + '/signup/simple', registerUser);
  }
}
