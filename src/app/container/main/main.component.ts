import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  currentUser: User;
  profile: boolean;
  carpool: boolean;
  routeFinder: boolean;
  page: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  profileClick() {
    this.profile = true;
    this.carpool = false;
    this.routeFinder = false;
    this.page = 'profile';

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
