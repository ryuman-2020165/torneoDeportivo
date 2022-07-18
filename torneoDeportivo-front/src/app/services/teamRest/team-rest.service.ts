import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root',
})
export class TeamRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.userRest.getToken(),
  });

  constructor(private http: HttpClient, private userRest: UserRestService) {}

  addTeam(idLeague: string, params: {}) {
    return this.http.post(
      environment.baseUrl + 'team/addTeam/' + idLeague,
      params,
      {
        headers: this.httpOptions,
      }
    );
  }

  getTeam(idLeague: string, idTeam: string) {
    return this.http.get(
      environment.baseUrl + 'team/getTeam/' + idLeague + '/' + idTeam,
      {
        headers: this.httpOptions,
      }
    );
  }

  getTeams(idLeague: string) {
    return this.http.get(environment.baseUrl + 'team/getTeams/' + idLeague, {
      headers: this.httpOptions,
    });
  }

  updateTeam(params: {}, idLeague: string, idTeam: string) {
    return this.http.put(
      environment.baseUrl + 'team/updateTeam/' + idLeague + '/' + idTeam,
      params,
      { headers: this.httpOptions }
    );
  }

  deleteTeam(idLeague: string, idTeam: string) {
    return this.http.delete(
      environment.baseUrl + 'team/deleteTeam/' + idLeague + '/' + idTeam,
      {
        headers: this.httpOptions,
      }
    );
  }

  createChart(idLeague: string) {
    return this.http.get(environment.baseUrl + 'team/createChart/' + idLeague, {
      headers: this.httpOptions,
    });
  }
}
