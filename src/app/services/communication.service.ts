import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CommunicationRequest} from '../models/communication/communication-request';
import {CommunicationRequestStatus} from '../models/communication/communication-request-status.enum';
import {RouteComplete} from '../models/route/route-complete';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  baseUrl = 'http://localhost:8080/communication';

  constructor(private http: HttpClient) {
  }

  getAllCommunicationRequest() {
    return this.http.get<CommunicationRequest[]>(this.baseUrl + '/all');
  }

  sendCommunicationRequest(request: CommunicationRequest) {
    return this.http.post(this.baseUrl, request);
  }

  updateCommunicationRequestStatus(requestId: string, status: CommunicationRequestStatus) {
    const options = {
      params: new HttpParams().set('requestId', requestId)
        .set('status', status.toString())
    };
    return this.http.put<RouteComplete>(this.baseUrl + '/status', null, options);
  }

  deleteCommunicationRequest(routeId: string, requestId: string) {
    const options = {
      params: new HttpParams().set('routeId', routeId)
        .set('requestId', requestId)
    };
    return this.http.delete(this.baseUrl, options);
  }
}
