import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root',
})
export class LeagueRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.userRest.getToken(),
  });

  constructor(private http: HttpClient, private userRest: UserRestService) {}

  addLeague(params: {}) {
    return this.http.post(environment.baseUrl + 'league/addLeague', params, {
      headers: this.httpOptions,
    });
  }

  getLeagues() {
    return this.http.get(environment.baseUrl + 'league/getLeagues', {
      headers: this.httpOptions,
    });
  }

  getLeague(id: string) {
    return this.http.get(environment.baseUrl + 'league/getLeague/' + id, {
      headers: this.httpOptions,
    });
  }

  updateLeague(params: {}, id: string) {
    return this.http.put(
      environment.baseUrl + 'league/updateLeague/' + id,
      params,
      { headers: this.httpOptions }
    );
  }

  deleteLeague(id: string) {
    return this.http.delete(environment.baseUrl + 'league/deleteLeague/' + id, {
      headers: this.httpOptions,
    });
  }

  //* Funciones de administrador

  addLeagueAdmin(params: {}) {
    return this.http.post(
      environment.baseUrl + 'league/addLeague_OnlyAdmin',
      params,
      {
        headers: this.httpOptions,
      }
    );
  }

  getLeaguesAdmin() {
    return this.http.get(environment.baseUrl + 'league/getLeagues_OnlyAdmin', {
      headers: this.httpOptions,
    });
  }

  getLeagueAdmin(id: string) {
    return this.http.get(
      environment.baseUrl + 'league/getLeague_OnlyAdmin/' + id,
      {
        headers: this.httpOptions,
      }
    );
  }

  updateLeagueAdmin(params: {}, id: string) {
    return this.http.put(
      environment.baseUrl + 'league/updateLeague_OnlyAdmin/' + id,
      params,
      { headers: this.httpOptions }
    );
  }

  deleteLeagueAdmin(id: string) {
    return this.http.delete(environment.baseUrl + 'league/deleteLeague_OnlyAdmin/' + id, {
      headers: this.httpOptions,
    });
  }
}
