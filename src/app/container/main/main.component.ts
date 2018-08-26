import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: User;
  guestUser: boolean;
  page: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService) {
  }

  ngOnInit() {
    const guestUserString = sessionStorage.getItem('guestUser');
    this.guestUser = guestUserString === 'true';

    if (!this.guestUser) {
      const loginUser = JSON.parse(sessionStorage.getItem('loginUser'));
      console.log(loginUser);
      const user = this.userService.getUserById(loginUser.id).subscribe(value => {
        console.log(value);
        sessionStorage.setItem('currentUser', JSON.stringify(value));
      });
    }
  }

  profileClick() {
    this.page = 'profile';

  }

  routeCreatorClick() {
    this.page = 'routeCreator';
  }

  routeFinderClick() {
    this.page = 'routeFinder';
  }
}
