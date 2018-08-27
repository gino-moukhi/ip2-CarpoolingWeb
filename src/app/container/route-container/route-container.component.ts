import {Component, Input, OnInit} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {RouteService} from '../../services/route.service';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-route-container',
  templateUrl: './route-container.component.html',
  styleUrls: ['./route-container.component.css']
})
export class RouteContainerComponent implements OnInit {
  @Input() isGuestUser: boolean;
  allRoutes: RouteComplete[];
  allReceivedRoutes: RouteComplete[];
  currentRoute: RouteComplete;
  // currentRouteUser: User;
  myRoutes: RouteComplete[];
  defaultTabIndex: number;
  emptyStateMessage: string;

  constructor(private routeService: RouteService) {
    this.allRoutes = [];
    this.allReceivedRoutes = [];
    this.myRoutes = [];
    this.defaultTabIndex = 1; // index to show all routes
    this.emptyStateMessage = 'Looks like nobody has created a route, will you be the first?'
  }

  ngOnInit() {
    if (!this.isGuestUser) {
      this.routeService.getRoutesOfUser(JSON.parse(sessionStorage.getItem('currentUser')).id).subscribe(value => {
        this.myRoutes = value;
        console.log(this.myRoutes);
      });
    }
    this.routeService.getRoutes().subscribe(value => {
      this.allRoutes = value;
      this.allReceivedRoutes = value;
    });
  }

  onRouteChanged(event) {
    console.log('THE ROUTE CHANGED IN THE CONTAINER');
    console.log(event);
    this.currentRoute = event;
  }

  onRoutesChanged(event) {
    console.log('THE ROUTES HAVE BEEN CHANGED IN THE CONTAINER');
    console.log(event);
    this.allReceivedRoutes = event;
  }

  allRoutesTabClicked(event) {
    console.log(event);
    switch (event) {
      case 0:
        if (!this.isGuestUser) {
          this.routeService.getRoutesOfUser(JSON.parse(sessionStorage.getItem('currentUser')).id).subscribe(value => {
            this.myRoutes = value;
            console.log(this.myRoutes);
          });
        }
        break;
      case 1:
        this.routeService.getRoutes().subscribe(value => {
          this.allRoutes = value;
          this.allReceivedRoutes = value;
        });
        break;
    }
  }
}
