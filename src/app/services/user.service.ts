import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {
  }
  getUsers() {
    return this.http.get<User[]>(this.baseUrl + '/all');
  }

  getUserById(id: string) {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  createUser(user: User) {
    console.log('POSTING USER');
    return this.http.post(this.baseUrl, user);
  }

  updateUser(user: User) {
    // return this.http.post(this.baseUrl + '/' + user.id, user);
    return this.http.put<User>(this.baseUrl, user);
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

}
