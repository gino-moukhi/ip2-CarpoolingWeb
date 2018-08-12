import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {RouteWaypoint} from '../../models/route/route-waypoint';
import {User} from '../../models/user/user';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';
import {UserService} from '../../services/user.service';
import {RouteUser} from '../../models/route/route-user';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.css']
})
export class RouteDetailComponent implements OnInit, OnChanges {
  @Input() receivedRoutes: RouteComplete[];
  @Input() isMyRoutes: boolean;
  @Output() routeChanged: EventEmitter<RouteComplete[]> = new EventEmitter<RouteComplete[]>();
  @Output() currentChildRoute: EventEmitter<RouteComplete> = new EventEmitter<RouteComplete>();
  currentRoute: RouteComplete;
  currentWaypoints: RouteWaypoint[] = [];
  currentUser: User;
  currentRouteUser: RouteUser;
  communicationFormIsOpen = false;
  isOwner = false;

  constructor(private userService: UserService, private mapsAPILoader: MapsAPILoader) {
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGES');
    console.log('CHANGES');
    console.log('CHANGES');
    console.log(changes);
  }

  onRouteClick(route: RouteComplete) {
    this.currentRoute = route;
    this.refreshWaypoints();
    this.onRoutesChanged();
    this.onRouteChanged();
    this.calculateCurrentDistance(this.currentRoute);
  }

  refreshWaypoints() {
    console.log('REFRESH CALLED');
    this.currentWaypoints = [];
    this.currentRoute.routeDefinition.waypoints.forEach(wp => {
      this.currentWaypoints.push(new RouteWaypoint(wp, true));
    });
  }

  // TODO implement or disable
  calculateCurrentDistance(route: RouteComplete) {
    /*this.mapsAPILoader.load().then(() => {
      const origin = new google.maps.LatLng(route.routeDefinition.origin.lat, route.routeDefinition.origin.lng);
      const destination = new google.maps.LatLng(route.routeDefinition.destination.lat, route.routeDefinition.destination.lng);
      const destinationArray = [];
      console.log('DESTINATION');
      console.log(destination);
      destinationArray.push(destination);
      console.log('DESTINATION ARRAY');
      console.log(destinationArray);
      route.routeDefinition.waypoints.forEach(wp => {
        destinationArray.push(new google.maps.LatLng(wp.lat, wp.lng));
      });
      const distanceMatrix = new google.maps.DistanceMatrixService;
      distanceMatrix.getDistanceMatrix({
        origins: [origin],
        destinations: destinationArray,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const origins = response.originAddresses;
          const destinations = response.destinationAddresses;

          for (let i = 0; i < origins.length; i++) {
            const results = response.rows[i].elements;
            for (let j = 0; j < results.length; j++) {
              const element = results[j];
              const distance = element.distance.text;
              const duration = element.duration.text;
              const from = origins[i];
              const to = destinations[j];
              console.log(results);
              console.log(element);
              console.log(distance);
              console.log(duration);
              console.log(from);
              console.log(to);
            }
          }
        }
      });
    });*/
  }

  onRoutesChanged() {
    console.log('ROUTES CHANGED IN DETAILS');
    this.routeChanged.emit(this.receivedRoutes);
  }

  onRouteChanged() {
    console.log('ROUTE CHANGED IN DETAILS');
    this.currentChildRoute.emit(this.currentRoute);
  }

  addPassengerToRoute() {
    console.log('current user');
    console.log(this.currentUser);
    console.log('current route user');
    // TODO replace with mat-dialog
    this.communicationFormIsOpen = !this.communicationFormIsOpen;
  }
}
