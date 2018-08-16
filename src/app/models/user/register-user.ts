import {Name} from './name';

export class RegisterUser {
  id: string;
  username: string;
  password: string;
  name: Name;
  token: string;

  constructor(id: string, username: string, password: string, name: Name, token: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.token = token;
  }
}
