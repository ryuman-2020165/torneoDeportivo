import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  test(message: string) {
    console.log(message);
  }

  testHttp() {
    return this.http.get(environment.baseUrl + 'user/test/', {
      headers: this.httpOptions,
    });
  }

  register(params: {}) {
    return this.http.post(environment.baseUrl + 'user/register', params, {
      headers: this.httpOptions,
    });
  }

  login(params: {}) {
    return this.http.post(environment.baseUrl + 'user/login', params, {
      headers: this.httpOptions,
    });
  }

  myProfile() {
    return this.http.get(environment.baseUrl + 'user/myProfile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getToken(),
      },
    });
  }

  updateProfile(params: {}) {
    return this.http.put(environment.baseUrl + 'user/update', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getToken(),
      },
    });
  }

  deleteProfile() {
    return this.http.delete(environment.baseUrl + 'user/delete', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getToken(),
      },
    });
  }

  addUserAdmin(params: {}) {
    return this.http.post(
      environment.baseUrl + 'user/register_OnlyAdmin',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken(),
        },
      }
    );
  }

  getUsersAdmin() {
    return this.http.get(environment.baseUrl + 'user/getUsers', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getToken(),
      },
    });
  }

  getUserAdmin(id: string) {
    return this.http.get(environment.baseUrl + 'user/getUser/' + id, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getToken(),
      },
    });
  }

  updateUserAdmin(params: {}, id: string) {
    return this.http.put(
      environment.baseUrl + 'user/update_OnlyAdmin/' + id,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken(),
        },
      }
    );
  }

  deleteUserAdmin(id: string) {
    return this.http.delete(
      environment.baseUrl + 'user/delete_OnlyAdmin/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken(),
        },
      }
    );
  }

  getToken() {
    let globalToken = localStorage.getItem('token');
    let token;
    if (globalToken != undefined) {
      token = globalToken;
    } else {
      token = '';
    }
    return token;
  }

  getIdentity() {
    let globalIdentity = localStorage.getItem('identity');
    let identity;
    if (globalIdentity != undefined) {
      identity = JSON.parse(globalIdentity);
    } else {
      identity = '';
    }
    return identity;
  }
}
