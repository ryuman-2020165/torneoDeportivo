import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  token: any;
  role: any;
  username: any;
  name: any;
  surname: any;

  constructor(private userRest: UserRestService) {}

  ngOnInit(): void {
    this.token = this.userRest.getToken();
    this.role = this.userRest.getIdentity().role;
    this.username = this.userRest.getIdentity().username;
    this.name = this.userRest.getIdentity().name;
    this.surname = this.userRest.getIdentity().surname;
  }

  logOut() {
    localStorage.clear();
  }
}
