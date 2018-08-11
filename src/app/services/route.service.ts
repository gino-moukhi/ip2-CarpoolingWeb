import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RouteComplete} from '../models/route/route-complete';
import {RouteLocation} from '../models/route/route-location';
import {SearchCriteria} from '../models/searching/search-criteria';
import {RouteUser} from '../models/route/route-user';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  baseUrl = 'http://localhost:8080/routes';

  constructor(private http: HttpClient) {
  }

  getRoutes() {
    return this.http.get<RouteComplete[]>(this.baseUrl + '/all');
  }

  getRouteById(id: string) {
    console.log('CREATE ROUTEDEF CALLED');
    return this.http.get<RouteComplete>(this.baseUrl + '/' + id);
  }

  getRoutesOfUser(userId: string) {
    const options = {
      params: new HttpParams().set('userId', userId)
    };
    return this.http.get<RouteComplete[]>(this.baseUrl + '/myRoutes', options);
  }

  getRoutesByLocationsSimple(criteria: SearchCriteria) {
    // const urlParams = '/' + origin.lat + '/' + origin.lng + '/' + destination.lat + '/' + destination.lng + '/' + distance;
    // return this.http.get<RouteComplete[]>(this.baseUrl + '/location' + urlParams);
    const options = {
      params: new HttpParams().set('originLat', criteria.origin.lat.toString())
        .set('originLng', criteria.origin.lng.toString())
        .set('destinationLat', criteria.destination.lat.toString())
        .set('destinationLng', criteria.destination.lng.toString())
        .set('distance', criteria.distance.toString())
    };
    return this.http.get<RouteComplete[]>(this.baseUrl + '/location/near/simple', options);
  }

  getRoutesByLocationsAdvanced(criteria: SearchCriteria) {
    const options = {
      params: new HttpParams().set('originLat', criteria.origin.lat.toString())
        .set('originLng', criteria.origin.lng.toString())
        .set('destinationLat', criteria.destination.lat.toString())
        .set('destinationLng', criteria.destination.lng.toString())
        .set('distance', criteria.distance.toString())
        .set('minDepartureTime', criteria.minDepartureTime.toUTCString())
        .set('maxDepartureTime', criteria.maxDepartureTime.toUTCString())
        .set('gender', criteria.gender.toString())
        .set('smoker', criteria.smoker.toString())
    };
    console.log('PARAMS');
    console.log(options.params);

    return this.http.get<RouteComplete[]>(this.baseUrl + '/location/near/advanced', options);
  }

  createRoute(route: RouteComplete) {
    console.log('CREATE ROUTE CALLED');
    console.log(route);
    return this.http.post(this.baseUrl, route);
  }

  updateRoute(route: RouteComplete) {
    // return this.http.post(this.baseUrl + '/' + user.id, user);
    return this.http.put<RouteComplete>(this.baseUrl, route);
  }

  addPassengerToRoute(routeId: string, routeUser: RouteUser) {
    const options = {
      params: new HttpParams().set('routeId', routeId)
    };
    return this.http.put(this.baseUrl + '/route/passenger', routeUser, options);
  }

  deleteRoute(id: string) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
