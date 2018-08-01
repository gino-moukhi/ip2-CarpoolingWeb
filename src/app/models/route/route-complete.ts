import {RouteDefinition} from './route-definition';

export class RouteComplete {
  id: string;
  routeDefinition: RouteDefinition;
  vehicleType: string;
  departure: Date;
  availablePassengers: number;


  constructor(definition: RouteDefinition, vehicleType: string, departure: Date, availablePassengers: number) {
    this.routeDefinition = definition;
    this.vehicleType = vehicleType;
    this.departure = departure;
    this.availablePassengers = availablePassengers;
  }
}
