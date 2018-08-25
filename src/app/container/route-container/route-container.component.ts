import {Component, OnInit} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {RouteService} from '../../services/route.service';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-route-container',
  templateUrl: './route-container.component.html',
  styleUrls: ['./route-container.component.css']
})
export class RouteContainerComponent implements OnInit {
  allRoutes: RouteComplete[];
  allReceivedRoutes: RouteComplete[];
  currentRoute: RouteComplete;
  // currentRouteUser: User;
  myRoutes: RouteComplete[];
  defaultTabIndex: number;

  constructor(private routeService: RouteService) {
    this.allRoutes = [];
    this.allReceivedRoutes = [];
    this.myRoutes = [];
    this.defaultTabIndex = 1; // index to show all routes
  }

  ngOnInit() {
    this.routeService.getRoutesOfUser(JSON.parse(sessionStorage.getItem('currentUser')).id).subscribe(value => {
      this.myRoutes = value;
      console.log(this.myRoutes);
    });
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
    console.log('CLICKED ON ALL ROUTES TAB');
    console.log(event);
    switch (event) {
      case 0:
        this.routeService.getRoutesOfUser(JSON.parse(sessionStorage.getItem('currentUser')).id).subscribe(value => {
          this.myRoutes = value;
          console.log(this.myRoutes);
        });
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
