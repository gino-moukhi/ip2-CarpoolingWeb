import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {CommunicationRequestStatus} from '../../models/communication/communication-request-status.enum';
import {CommunicationService} from '../../services/communication.service';
import {RouteDetailComponent} from '../route-detail/route-detail.component';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CommunicationRequest} from '../../models/communication/communication-request';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-route-myroutes',
  templateUrl: './route-myroutes.component.html',
  styleUrls: ['./route-myroutes.component.css']
})
export class RouteMyroutesComponent implements OnInit, AfterViewInit {
  @Input() receivedRoutes: RouteComplete[];
  @Input() isGuestUser: boolean;
  @Output() routeChanged: EventEmitter<RouteComplete[]> = new EventEmitter<RouteComplete[]>();
  @Output() currentChildRoute: EventEmitter<RouteComplete> = new EventEmitter<RouteComplete>();
  @ViewChild(RouteDetailComponent) detailsComponent: RouteDetailComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  allRoutes: RouteComplete[];
  currentRoute: RouteComplete;
  acceptStatus = CommunicationRequestStatus.ACCEPTED;
  declineStatus = CommunicationRequestStatus.DECLINED;
  isOwner = false;
  requestsDataSource: MatTableDataSource<CommunicationRequest>;

  displayedColumns: string[] = ['passengerName', 'originName', 'destinationName', 'comment', 'requestStatus', 'actions'];


  constructor(private communicationService: CommunicationService) {
  }

  ngOnInit() {
    console.log('ENTERED MY ROUTES');
    console.log(this.receivedRoutes);
    console.log(this.currentRoute);
  }

  ngAfterViewInit() {
    // this.requestsDataSource = new MatTableDataSource([]);
    /*this.requestsDataSource.paginator = this.paginator;
    this.requestsDataSource.sort = this.sort;*/
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
    if (!this.isGuestUser) {
      this.isOwner = this.currentRoute.owner.id === JSON.parse(sessionStorage.getItem('currentUser')).id;
    }
    console.log(this.currentRoute.communicationRequests);
    this.requestsDataSource = new MatTableDataSource<CommunicationRequest>(this.currentRoute.communicationRequests);
    console.log(this.requestsDataSource.paginator);
    console.log(this.requestsDataSource.sort);
    this.requestsDataSource.paginator = this.paginator;
    this.requestsDataSource.sort = this.sort;
    console.log(this.requestsDataSource.paginator);
    console.log(this.requestsDataSource.sort);
    console.log('DATASOURCE');
    console.log(this.requestsDataSource);
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

  deleteCommunicationRequest(routeId: string, requestId: string) {
    this.communicationService.deleteCommunicationRequest(routeId, requestId).subscribe();
  }

  log() {
    console.log(this.receivedRoutes);
    console.log(this.currentRoute);
    console.log(!!this.currentRoute);
  }
}
