import {RouteLocation} from './route-location';
import {RouteType} from './route-type.enum';

export class RouteDefinition {
  origin: RouteLocation;
  destination: RouteLocation;
  routeType: RouteType;
  waypoints: RouteLocation[];

  constructor(origin: RouteLocation, destination: RouteLocation, routeType: RouteType, waypoints: RouteLocation[]) {
    this.origin = origin;
    this.destination = destination;
    this.routeType = routeType;
    this.waypoints = waypoints;
  }
}
