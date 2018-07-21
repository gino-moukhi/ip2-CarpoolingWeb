import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  login = false;
  register = true;
  buttonText = 'Login';

  constructor() { }

  ngOnInit() {
  }

  onFormChange() {
    this.login = !this.login;
    this.register = !this.register;
    if (this.login) {
      this.buttonText = 'Register';
    } else {
      this.buttonText = 'Login';
    }
  }
}
