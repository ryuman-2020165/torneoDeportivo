import { Component, OnInit } from '@angular/core';
import { LeagueRestService } from 'src/app/services/leagueRest/league-rest.service';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import { LeagueModel } from 'src/app/models/league.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leagues-admin',
  templateUrl: './leagues-admin.component.html',
  styleUrls: ['./leagues-admin.component.css'],
})
export class LeaguesAdminComponent implements OnInit {
  users: any;

  league: LeagueModel;
  leagues: any;
  leagueGetId: any;

  constructor(
    private leagueRest: LeagueRestService,
    private userRest: UserRestService
  ) {
    this.league = new LeagueModel('', '', '', '');
  }

  ngOnInit(): void {
    this.getLeaguesAdmin();
    this.getUsersAdmin();
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

  addLeagueAdmin(addLeagueForm: any) {
    this.leagueRest.addLeagueAdmin(this.league).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        this.getLeaguesAdmin();
        addLeagueForm.reset();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getLeagueAdmin(id: string) {
    this.leagueRest.getLeagueAdmin(id).subscribe({
      next: (res: any) => {
        this.leagueGetId = res.league;
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getLeaguesAdmin() {
    this.leagueRest.getLeaguesAdmin().subscribe({
      next: (res: any) => {
        this.leagues = res.leagues;
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  updateLeagueAdmin() {
    this.leagueGetId.user = undefined;
    this.leagueGetId.teams = undefined;
    this.leagueGetId.journeys = undefined;
    this.leagueRest
      .updateLeagueAdmin(this.leagueGetId, this.leagueGetId._id)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getLeaguesAdmin();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  deleteLeagueAdmin(id: string) {
    this.leagueRest.deleteLeagueAdmin(id).subscribe({
      next: (res: any) => {
        Swal.fire(res.message, res.deleteLeague.name, 'success');

        this.getLeaguesAdmin();
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
