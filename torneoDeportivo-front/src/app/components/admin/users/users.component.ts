import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import { UserModel } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  user: UserModel;
  users: any;
  userGetId: any;

  constructor(private userRest: UserRestService) {
    this.user = new UserModel('', '', '', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.getUsersAdmin();
  }

  addUserAdmin(addUserForm: any) {
    this.userRest.addUserAdmin(this.user).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        this.getUsersAdmin();
        addUserForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getUsersAdmin() {
    this.userRest.getUsersAdmin().subscribe({
      next: (res: any) => {
        this.users = res.users;
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  getUserAdmin(id: string) {
    this.userRest.getUserAdmin(id).subscribe({
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

  updateUserAdmin() {
    this.userGetId.password = undefined;
    this.userRest
      .updateUserAdmin(this.userGetId, this.userGetId._id)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getUsersAdmin();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  deleteUserAdmin(id: string) {
    this.userRest.deleteUserAdmin(id).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });

        this.getUsersAdmin();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }
}
