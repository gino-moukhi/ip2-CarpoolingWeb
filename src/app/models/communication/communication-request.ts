import {RouteLocation} from '../route/route-location';
import {CommunicationRequestStatus} from './communication-request-status.enum';
import {RouteUser} from '../route/route-user';

export class CommunicationRequest {
  id: string;
  routeId: string;
  // userId: string;
  user: RouteUser;
  origin: RouteLocation;
  destination: RouteLocation;
  comment: string;
  requestStatus: CommunicationRequestStatus;

  constructor(id: string, routeId: string, /*userId: string*/ user: RouteUser, origin: RouteLocation, destination: RouteLocation,
              comment: string, requestStatus: CommunicationRequestStatus) {
    this.id = id;
    this.routeId = routeId;
    // this.userId = userId;
    this.user = user;
    this.origin = origin;
    this.destination = destination;
    this.comment = comment;
    this.requestStatus = requestStatus;
  }
}
