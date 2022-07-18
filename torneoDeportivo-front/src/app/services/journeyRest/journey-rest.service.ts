import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root',
})
export class JourneyRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.userRest.getToken(),
  });

  constructor(private http: HttpClient, private userRest: UserRestService) {}

  getJourneys(idLeague: string) {
    return this.http.get(
      environment.baseUrl + 'journey/getJourneys/' + idLeague,
      {
        headers: this.httpOptions,
      }
    );
  }

  getJourney(idLeague: string, idJourney: string) {
    return this.http.get(
      environment.baseUrl + 'journey/getJourney/' + idLeague + '/' + idJourney,
      {
        headers: this.httpOptions,
      }
    );
  }

  updateJourney(params: {}, idLeague: string, idJourney: string) {
    return this.http.put(
      environment.baseUrl + 'journey/updateJourney/' + idLeague + '/' + idJourney,
      params,
      { headers: this.httpOptions }
    );
  }
}
