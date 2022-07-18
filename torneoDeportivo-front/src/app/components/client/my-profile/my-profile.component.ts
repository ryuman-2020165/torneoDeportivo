import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  constructor(private userRest: UserRestService) {}

  userGetId: any;

  ngOnInit(): void {
    this.myProfile();
  }

  myProfile() {
    this.userRest.myProfile().subscribe({
      next: (res: any) => {
        this.userGetId = res.user;
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  updateProfile() {
    this.userGetId.password = undefined;
    this.userGetId.role = undefined;
    this.userRest.updateProfile(this.userGetId).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        this.myProfile();
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  deleteProfile() {
    this.userRest.deleteProfile().subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
    localStorage.clear();
  }
}
