import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root',
})
export class MatchRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.userRest.getToken(),
  });

  constructor(private http: HttpClient, private userRest: UserRestService) {}

  addMatch(params: {}, idLeague: string, idJourney: string) {
    return this.http.post(
      environment.baseUrl + 'journey/addMatch/' + idLeague + '/' + idJourney,
      params,
      {
        headers: this.httpOptions,
      }
    );
  }

  getMatches(idLeague: string, idJourney: string) {
    return this.http.get(
      environment.baseUrl + 'journey/getMatches/' + idLeague + '/' + idJourney,
      {
        headers: this.httpOptions,
      }
    );
  }

  getMatch(idLeague: string, idJourney: string, idMatch: string) {
    return this.http.get(
      environment.baseUrl +
        'journey/getMatch/' +
        idLeague +
        '/' +
        idJourney +
        '/' +
        idMatch,
      {
        headers: this.httpOptions,
      }
    );
  }

  updateMatch(
    params: {},
    idLeague: string,
    idJourney: string,
    idMatch: string
  ) {
    return this.http.put(
      environment.baseUrl +
        'journey/updateMatch/' +
        idLeague +
        '/' +
        idJourney +
        '/' +
        idMatch,
      params,
      { headers: this.httpOptions }
    );
  }

  deleteMatch(idLeague: string, idJourney: string, idMatch: string) {
    return this.http.delete(
      environment.baseUrl +
        'journey/deleteMatch/' +
        idLeague +
        '/' +
        idJourney +
        '/' +
        idMatch,
      {
        headers: this.httpOptions,
      }
    );
  }
}
