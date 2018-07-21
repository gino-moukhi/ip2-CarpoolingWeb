import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {Name} from '../../models/name';
import {Address} from '../../models/address';
import {Vehicle} from '../../models/vehicle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: User;
  // activeItem: any;
  profile: boolean;
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
    this.page = 'profile';

  }

  onUserChanged($event: User) {
    this.currentUser = $event;
  }
}
