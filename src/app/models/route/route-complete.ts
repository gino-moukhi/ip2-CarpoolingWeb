import {RouteDefinition} from './route-definition';
import {RouteUser} from './route-user';
import {CommunicationRequest} from '../communication/communication-request';

export class RouteComplete {
  id: string;
  routeDefinition: RouteDefinition;
  vehicleType: string;
  departure: Date;
  availablePassengers: number;
  owner: RouteUser;
  passengers: RouteUser[];
  communicationRequests: CommunicationRequest[];


  constructor(id: string, definition: RouteDefinition, vehicleType: string, departure: Date, availablePassengers: number, owner: RouteUser,
              passengers: RouteUser[], communicationRequest: CommunicationRequest[]) {
    this.id = id;
    this.routeDefinition = definition;
    this.vehicleType = vehicleType;
    this.departure = departure;
    this.availablePassengers = availablePassengers;
    this.owner = owner;
    this.passengers = passengers;
    this.communicationRequests = communicationRequest;
  }
}
