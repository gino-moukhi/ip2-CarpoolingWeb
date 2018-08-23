import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {CommunicationRequestStatus} from '../../models/communication/communication-request-status.enum';
import {CommunicationService} from '../../services/communication.service';
import {RouteDetailComponent} from '../route-detail/route-detail.component';

@Component({
  selector: 'app-route-myroutes',
  templateUrl: './route-myroutes.component.html',
  styleUrls: ['./route-myroutes.component.css']
})
export class RouteMyroutesComponent implements OnInit {
  @Input() receivedRoutes: RouteComplete[];
  @Output() routeChanged: EventEmitter<RouteComplete[]> = new EventEmitter<RouteComplete[]>();
  @Output() currentChildRoute: EventEmitter<RouteComplete> = new EventEmitter<RouteComplete>();
  @ViewChild(RouteDetailComponent) detailsComponent: RouteDetailComponent;
  allRoutes: RouteComplete[];
  currentRoute: RouteComplete;
  acceptStatus = CommunicationRequestStatus.ACCEPTED;
  declineStatus = CommunicationRequestStatus.DECLINED;
  isOwner = false;

  constructor(private communicationService: CommunicationService) {
  }

  ngOnInit() {
    console.log('ENTERED MY ROUTES');
    console.log(this.receivedRoutes);
  }

  onRoutesChanged(event) {
    console.log('THE ROUTES HAVE BEEN CHANGED IN MY ROUTES');
    console.log('RECEIVED EVENT');
    console.log(event);
    if (event instanceof Array) {
      console.log('passed argument is an array');
      this.allRoutes = event;
    } else {
      console.log('passed argumant is something else');
      const routeToUpdate = this.allRoutes.find(r => r.id === event.id);
      routeToUpdate.availablePassengers = event.availablePassengers;
      routeToUpdate.passengers = event.passengers;
      routeToUpdate.routeDefinition.waypoints = event.routeDefinition.waypoints;
      routeToUpdate.communicationRequests = event.communicationRequests;
      console.log('NEW VAL');
      console.log(routeToUpdate);
    }
    console.log('NEWLY RECEIVED ALL ROUTES');
    console.log(this.allRoutes);
    this.receivedRoutes = this.allRoutes;
    this.routeChanged.emit(this.allRoutes);
  }

  onRouteChanged(event) {
    console.log('THE ROUTE HAS BEEN CHANGED IN MY ROUTES');
    this.currentRoute = event;
    this.isOwner = this.currentRoute.owner.id === sessionStorage.getItem('currentUser');
    console.log(this.currentRoute.communicationRequests);
    this.currentChildRoute.emit(this.currentRoute);
  }

  handleRequestClick(requestId: string, status: CommunicationRequestStatus) {
    console.log(requestId);
    console.log(status);
    this.communicationService.updateCommunicationRequestStatus(requestId, status).subscribe(value => {
      console.log('VALUE');
      console.log(value);
      this.onRouteChanged(value);
      this.onRoutesChanged(value);
      this.detailsComponent.refreshWaypoints();
    }, error1 => {
      console.log('ERROR');
      console.log(error1);
    });
  }
}
