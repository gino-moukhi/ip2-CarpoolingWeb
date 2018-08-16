export class LoginUser {
  id: string;
  username: string;
  password: string;
  token: string;

  constructor(id: string, username: string, password: string, token: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.token = token;
  }
}
