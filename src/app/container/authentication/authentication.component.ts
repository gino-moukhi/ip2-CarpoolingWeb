import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {VehicleType} from '../../models/user/vehicle-type.enum';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  selectedIndex: number;

  constructor() {
  }

  ngOnInit() {
  }

  switchTab(event) {
    if (event === true) {
      this.selectedIndex = 0;
    }
  }
}
