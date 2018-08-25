import {RouteLocation} from '../route/route-location';
import {SearchCriteriaAcceptanceType} from './search-criteria-acceptance-type.enum';

export class SearchCriteria {
  origin: RouteLocation;
  destination: RouteLocation;
  distance: number;
  minDepartureTime: Date;
  maxDepartureTime: Date;
  gender: SearchCriteriaAcceptanceType;
  smoker: SearchCriteriaAcceptanceType;

  constructor(origin: RouteLocation, destination: RouteLocation, distance: number, minDepartureTime: Date, maxDepartureTime: Date,
              gender: SearchCriteriaAcceptanceType, smoker: SearchCriteriaAcceptanceType) {
    this.origin = origin;
    this.destination = destination;
    this.distance = distance;
    this.minDepartureTime = minDepartureTime;
    this.maxDepartureTime = maxDepartureTime;
    this.gender = gender;
    this.smoker = smoker;
  }
}
