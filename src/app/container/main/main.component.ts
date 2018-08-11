import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: User;
  // activeItem: any;
  profile: boolean;
  carpool: boolean;
  routeFinder: boolean;
  page: string;
  @ViewChild('profile') profileElement: ElementRef;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.currentUser = new User();
    this.currentUser.name = new Name();
    this.currentUser.address = new Address();
    this.currentUser.vehicle = new Vehicle();
    this.userService.getUserById(sessionStorage.getItem('currentUser')).subscribe(data => {
      this.currentUser = data;
    });
  }

  /*changeActive(newActiveItem) {
    this.activeItem.classList.remove('active');
    this.activeItem = newActiveItem;
    this.activeItem.classList.add('active');
  }*/


  profileClick() {
    // this.changeActive(this.profileElement.nativeElement);
    this.profile = true;
    this.carpool = false;
    this.routeFinder = false;
    this.page = 'profile';

  }

  onUserChanged($event: User) {
    this.currentUser = $event;
  }

  carpoolClick() {
    this.profile = false;
    this.carpool = true;
    this.routeFinder = false;
    this.page = 'carpool';
  }

  routeFinderClick() {
    this.profile = false;
    this.carpool = false;
    this.routeFinder = true;
    this.page = 'routeFinder';
  }
}
