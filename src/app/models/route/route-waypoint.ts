import {RouteLocation} from './route-location';

export class RouteWaypoint {
  name: string;
  location: RouteLocation;
  stopover: boolean;

  constructor(location: RouteLocation, stopover: boolean) {
    this.location = location;
    this.stopover = stopover;
  }
}
