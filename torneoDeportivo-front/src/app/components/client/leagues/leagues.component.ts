import { Component, OnInit } from '@angular/core';
import { LeagueRestService } from 'src/app/services/leagueRest/league-rest.service';
import { LeagueModel } from 'src/app/models/league.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.css'],
})
export class LeaguesComponent implements OnInit {
  league: LeagueModel;
  leagues: any;
  leagueGetId: any;

  constructor(private leagueRest: LeagueRestService) {
    this.league = new LeagueModel('', '', '', '');
  }

  ngOnInit(): void {
    this.getLeagues();
  }

  addLeague(addLeagueForm: any) {
    this.leagueRest.addLeague(this.league).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        this.getLeagues();
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

  getLeague(id: string) {
    this.leagueRest.getLeague(id).subscribe({
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

  getLeagues() {
    this.leagueRest.getLeagues().subscribe({
      next: (res: any) => {
        this.leagues = res.leagues;
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  updateLeague() {
    this.leagueGetId.user = undefined;
    this.leagueGetId.teams = undefined;
    this.leagueGetId.journeys = undefined;
    this.leagueRest
      .updateLeague(this.leagueGetId, this.leagueGetId._id)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getLeagues();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  deleteLeague(id: string) {
    this.leagueRest.deleteLeague(id).subscribe({
      next: (res: any) => {
        Swal.fire(res.message, res.deleteLeague.name, 'success');

        this.getLeagues();
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
