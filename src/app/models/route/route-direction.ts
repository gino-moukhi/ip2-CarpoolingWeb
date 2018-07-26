import LatLng = google.maps.LatLng;
import {RouteLocation} from './route-location';
import {RouteWaypoint} from './route-waypoint';

export class RouteDirection {
  /*origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];*/
  origin: RouteLocation;
  destination: RouteLocation;
  waypoints: RouteWaypoint[];

  constructor(origin: RouteLocation, destination: RouteLocation, waypoints: RouteWaypoint[]) {
    this.origin = origin;
    this.destination = destination;
    this.waypoints = waypoints;
  }
}
