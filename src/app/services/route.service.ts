import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RouteComplete} from '../models/route/route-complete';
import {User} from '../models/user/user';
import {RouteDefinition} from '../models/route/route-definition';
import {t} from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  baseUrl = 'http://localhost:8080/routes';

  constructor(private http: HttpClient) {
  }

  getRoutes() {
    return this.http.get<any[]>(this.baseUrl + '/all');
  }

  getRouteById(id: string) {
    console.log('CREATE ROUTEDEF CALLED');
    return this.http.get<RouteComplete>(this.baseUrl + '/' + id);
  }

  createRoute(route: RouteComplete) {
    console.log('CREATE ROUTE CALLED');
    return this.http.post(this.baseUrl, route);
  }

  updateRoute(route: RouteComplete) {
    // return this.http.post(this.baseUrl + '/' + user.id, user);
    return this.http.put<RouteComplete>(this.baseUrl, route);
  }

  deleteRoute(id: string) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
