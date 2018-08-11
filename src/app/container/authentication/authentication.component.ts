import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {VehicleType} from '../../models/user/vehicle-type.enum';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  login = false;
  register = true;
  buttonText = 'Login';
  allUsers: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe(data => {
        this.allUsers = data;
        console.log(this.allUsers);
      });

    console.log(VehicleType.SEDAN);
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

  onRegisterViewChanged(event) {
    this.login = event;
    this.register = !event;
  }
}
