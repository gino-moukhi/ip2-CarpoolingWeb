import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: User;
  guestUser: boolean;
  page: string;
  isIncompleteProfile: boolean;
  fieldsToUpdate: string[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    const guestUserString = sessionStorage.getItem('guestUser');
    this.guestUser = guestUserString === 'true';

    if (!this.guestUser) {
      const loginUser = JSON.parse(sessionStorage.getItem('loginUser'));
      console.log(loginUser);
      this.userService.getUserById(loginUser.id).subscribe(value => {
        console.log(value);
        sessionStorage.setItem('currentUser', JSON.stringify(value));
        this.currentUser = value;
        this.determenIfUserHasEmptyFields(this.currentUser);
        console.log(this.isIncompleteProfile);
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

  handleLoginOrLogout() {
    if (this.guestUser) {
      sessionStorage.setItem('guestUser', '');
      this.router.navigateByUrl('/authentication');
    } else {
      sessionStorage.setItem('loginUser', '');
      sessionStorage.setItem('currentUser', '');
      this.router.navigateByUrl('/authentication');
    }
  }

  onIncompleteProfileUpdate(isIncomplete) {
    this.isIncompleteProfile = isIncomplete;
  }

  onIncompleteFieldsUpdate(fields) {
    this.fieldsToUpdate = fields;
  }

  private determenIfUserHasEmptyFields(user: User) {
    const emptyFields = [];
    for (const element in user) {
      if (element) {
        for (const el in user[element]) {
          if (element === 'name' || element === 'address' || element === 'vehicle') {
            if (!user[element][el]) {
              emptyFields.push(el);
            }
          }
        }
      }
    }
    if (emptyFields.length !== 0) {
      this.isIncompleteProfile = true;
      this.fieldsToUpdate = emptyFields;
    }
  }
}
