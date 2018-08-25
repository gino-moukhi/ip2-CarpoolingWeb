import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {RouteWaypoint} from '../../models/route/route-waypoint';
import {User} from '../../models/user/user';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';
import {UserService} from '../../services/user.service';
import {RouteUser} from '../../models/route/route-user';
import {MapsAPILoader} from '@agm/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RouteLocation} from '../../models/route/route-location';
import {ControlPosition, MapTypeControlStyle} from '@agm/core/services/google-maps-types';
import {CommunicationFormComponent} from '../communication-form/communication-form.component';
import {RouteEditDialogComponent} from '../route-edit-dialog/route-edit-dialog.component';
import {RouteDefinition} from '../../models/route/route-definition';
import {RouteService} from '../../services/route.service';
import {CommunicationService} from '../../services/communication.service';
import {CommunicationRequestStatus} from '../../models/communication/communication-request-status.enum';

export interface CustomDataTable {
  origin: string;
  destination: string;
  route: string;
  departure: string;
  waypoints: string[];
}

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentRoute: RouteComplete;
  currentWaypoints: RouteWaypoint[] = [];
  currentUser: User;
  currentRouteUser: RouteUser;
  isOwner = false;
  allRoutesDataSource: MatTableDataSource<RouteComplete>;
  currentRouteDataSource: MatTableDataSource<RouteComplete>;
  allRoutesDisplayedColumns: string[] = ['origin', 'destination', 'departure', 'waypoints', 'actions'];
  generalRouteInfoDisplayedColumns: string[] = ['owner', 'route', 'vehicle', 'passengers'];
  // routeDetailsInfoDisplayedColumns: string[] = ['origin', 'destination', 'routeType', 'departure', 'waypoints'];

  waypointDataSource: MatTableDataSource<RouteLocation>;
  waypointDisplayColumns: string[];
  passengerDataSource: MatTableDataSource<RouteUser>;
  passengerDisplayColumns: string[];
  private trafficLayer: google.maps.TrafficLayer;
  private currentMapInstance: google.maps.Map;

  constructor(private dialog: MatDialog, private routeService: RouteService, private communicationService: CommunicationService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log('RECEIVED ON INIT');
    console.log(this.receivedRoutes);
  }

  ngOnChanges() {
    console.log('RECEIVED ON CHANGE');
    console.log(this.receivedRoutes);
    this.allRoutesDataSource = new MatTableDataSource<RouteComplete>(this.receivedRoutes);
    this.allRoutesDataSource.paginator = this.paginator;
    this.allRoutesDataSource.sort = this.sort;
    console.log('DATA SOURCE');
    console.log(this.allRoutesDataSource);
  }

  onRouteClick(route: RouteComplete) {
    this.currentRoute = route;
    this.refreshWaypoints();
    this.onRoutesChanged();
    this.onRouteChanged();
    this.currentRouteDataSource = new MatTableDataSource([this.currentRoute]);
    this.currentRouteDataSource.paginator = this.paginator;
    this.currentRouteDataSource.sort = this.sort;
    this.initWaypointsTable();
    this.initPassengersTable();
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

  addPassengerToRoute(route) {
    this.currentRouteUser = new RouteUser(this.currentUser);
    console.log('current user');
    console.log(this.currentRouteUser);

    this.currentRoute = route;
    console.log('current route');
    console.log(this.currentRoute);
    console.log(route);
    this.dialog.open(CommunicationFormComponent, {
      data: {
        currentRouteId: this.currentRoute.id,
        currentRouteUser: this.currentRouteUser
      }
    });
  }

  editRoute(route) {
    const dialogRef = this.dialog.open(RouteEditDialogComponent, {
      data: {
        /*routeDefinition: route.routeDefinition,
        departure: route.departure*/
        route: route
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      console.log('DATA RECEIVED FROM DIALOG');
      console.log(value);
      this.currentRoute = value;
      let routeToUpdateInArray = this.receivedRoutes.find(r => r.id === value.id);
      routeToUpdateInArray = value;
      console.log('EDITED PROPERTIES');
      console.log(routeToUpdateInArray);
      console.log(this.receivedRoutes);
    });
  }

  deleteRoute(route) {
    console.log(route);
    this.routeService.deleteRoute(route.id).subscribe(() => {
      this.currentRoute = this.receivedRoutes[0];
      this.receivedRoutes.splice(this.receivedRoutes.indexOf(route), 1);
      this.onRouteChanged();
      this.onRoutesChanged();
      this.allRoutesDataSource = new MatTableDataSource<RouteComplete>(this.receivedRoutes);
      this.currentRouteDataSource = new MatTableDataSource([this.currentRoute]);
    });
  }

  leaveRoute(route: RouteComplete) {
    const requestToSend = route.communicationRequests.find(r => r.user.id === this.currentUser.id);
    this.communicationService.updateCommunicationRequestStatus(requestToSend.id, CommunicationRequestStatus.DECLINED).subscribe(value => {
      this.currentRoute = value;
    });
  }

  showMatchingLetter(index: number): string {
    return String.fromCharCode(66 + index);
  }

  onMapReady(mapInstance) {
    const controlDiv = document.createElement('div');
    this.trafficControl(controlDiv);
    mapInstance.controls[ControlPosition.TOP_CENTER].push(controlDiv);
    mapInstance.mapTypeControl = true;
    mapInstance.fullscreenControl = true;
    mapInstance.mapTypeControlOptions = {
      style: MapTypeControlStyle.HORIZONTAL_BAR,
      mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid']
    };
    this.currentMapInstance = mapInstance;
    this.trafficLayer = new google.maps.TrafficLayer();
  }

  private initWaypointsTable() {
    this.waypointDisplayColumns = ['letter', 'waypoints'];
    this.waypointDataSource = new MatTableDataSource(this.currentRoute.routeDefinition.waypoints);
    console.log(this.waypointDataSource);
  }

  private initPassengersTable() {
    this.passengerDisplayColumns = ['email', 'name'];
    this.passengerDataSource = new MatTableDataSource(this.currentRoute.passengers);
    console.log(this.waypointDataSource);
  }

  private swapTrafficLayer() {
    if (this.trafficLayer.getMap() == null) {
      this.trafficLayer.setMap(this.currentMapInstance);
    } else {
      this.trafficLayer.setMap(null);
    }
  }

  private trafficControl(controlDiv) {
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to show traffic';
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '11px';
    controlText.style.lineHeight = '26px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show traffic';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', () => {
      if (controlUI.children[0].innerHTML === 'Show traffic') {
        controlUI.children[0].innerHTML = 'Hide traffic';
      } else {
        controlUI.children[0].innerHTML = 'Show traffic';
      }
      this.swapTrafficLayer();
    });
    controlUI.addEventListener('mouseover', () => {
      controlUI.style.backgroundColor = '#d9d9d9';
      controlUI.style.borderColor = '#d9d9d9';
    });
    controlUI.addEventListener('mouseout', () => {
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.borderColor = '#fff';
    });
  }
}
