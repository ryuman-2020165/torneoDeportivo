import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

import { ActivatedRoute } from '@angular/router';
import { TeamRestService } from 'src/app/services/teamRest/team-rest.service';
import { JourneyRestService } from 'src/app/services/journeyRest/journey-rest.service';
import { MatchRestService } from 'src/app/services/matchRest/match-rest.service';
import { TeamModel } from 'src/app/models/team.model';
import { JourneyModel } from 'src/app/models/journey.model';
import { MatchModel } from 'src/app/models/match.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-league',
  templateUrl: './view-league.component.html',
  styleUrls: ['./view-league.component.css'],
})
export class ViewLeagueComponent implements OnInit {
  idLeague: any;
  team: TeamModel;
  teams: any;
  teamGetId: any;

  idJourney: any;
  journey: JourneyModel;
  journeys: any;
  journeyGetId: any;

  match: MatchModel;
  matches: any;
  matchGetId: any;

  constructor(
    private teamRest: TeamRestService,
    private journeyRest: JourneyRestService,
    private matchRest: MatchRestService,
    public activatedRoute: ActivatedRoute
  ) {
    this.team = new TeamModel('', '', '', 0, 0, 0, 0);
    this.journey = new JourneyModel('', '', '');
    this.match = new MatchModel('', 0, '', 0);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((idRoute) => {
      this.idLeague = idRoute.get('id');
    });
    this.getTeams();
  }

  //* Funciones de equipos

  addTeam(addTeamForm: any) {
    this.teamRest.addTeam(this.idLeague, this.team).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        this.getTeams();
        addTeamForm.reset();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getTeam(idTeam: string) {
    this.teamRest.getTeam(this.idLeague, idTeam).subscribe({
      next: (res: any) => {
        this.teamGetId = res.team;
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getTeams() {
    this.teamRest.getTeams(this.idLeague).subscribe({
      next: (res: any) => {
        this.teams = res.teams;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  updateTeam() {
    this.teamGetId.proGoals = undefined;
    this.teamGetId.againstGoals = undefined;
    this.teamGetId.differenceGoals = undefined;
    this.teamGetId.playedMatches = undefined;
    this.teamRest
      .updateTeam(this.teamGetId, this.idLeague, this.teamGetId._id)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getTeams();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  deleteTeam(idTeam: string) {
    this.teamRest.deleteTeam(this.idLeague, idTeam).subscribe({
      next: (res: any) => {
        Swal.fire(res.message, res.deleteTeam.name, 'success');

        this.getTeams();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  //* Funciones de jornadas

  getJourneys() {
    this.journeyRest.getJourneys(this.idLeague).subscribe({
      next: (res: any) => {
        this.journeys = res.journeys;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getJourney(idJourney: string) {
    this.journeyRest.getJourney(this.idLeague, idJourney).subscribe({
      next: (res: any) => {
        this.idJourney = res.journey._id;
        this.journeyGetId = res.journey;
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  updateJourney() {
    this.journeyGetId.match = undefined;
    this.journeyRest
      .updateJourney(this.journeyGetId, this.idLeague, this.journeyGetId._id)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getJourneys();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  //* Funciones de partidos

  addMatch(addMatchForm: any) {
    this.matchRest
      .addMatch(this.match, this.idLeague, this.idJourney)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getTeams();
          this.getMatches(this.idJourney);
          addMatchForm.reset();
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  getMatch(idMatch: string) {
    this.matchRest.getMatch(this.idLeague, this.idJourney, idMatch).subscribe({
      next: (res: any) => {
        this.matchGetId = res.match;
        this.getTeams();
        this.getMatches(this.idJourney);
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: err.error.message || err.error,
        });
      },
    });
  }

  getMatches(idJourney: string) {
    this.matchRest.getMatches(this.idLeague, idJourney).subscribe({
      next: (res: any) => {
        this.getJourney(idJourney);

        this.matches = res.matches;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  updateMatch() {
    this.matchRest
      .updateMatch(
        this.matchGetId,
        this.idLeague,
        this.idJourney,
        this.matchGetId._id
      )
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          this.getTeams();
          this.getMatches(this.idJourney);
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  deleteMatch(idMatch: string) {
    this.matchRest
      .deleteMatch(this.idLeague, this.idJourney, idMatch)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });

          this.getTeams();
          this.getMatches(this.idJourney);
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'warning',
            title: err.error.message || err.error,
          });
        },
      });
  }

  //* Gráficas

  namesTeams: any = [];
  proGoalsTeams: Array<number> = [];
  againstGoalsTeams: Array<number> = [];

  leagueChartOptions = {
    responsive: true,
    scales: {
      x: {},
    },
  };

  leagueChartLabels: any = [];
  leagueChartData: any = [];

  leagueChartColors: any = [
    { backgroundColor: 'rgba(140, 228, 131, 0.8)' },
    { backgroundColor: 'rgba(228, 131, 131, 0.8)' },
  ];

  leagueChartLegend = true;

  leagueChartType = 'bar';

  modelTeamsGet: any = [];

  createChart() {
    this.teamRest.createChart(this.idLeague).subscribe({
      next: (res: any) => {
        this.leagueChartLabels.length = 0;
        this.leagueChartData.length = 0;
        this.modelTeamsGet.length = 0;

        this.modelTeamsGet = res.teams.forEach(({ data: team }: any) => {
          this.modelTeamsGet.push(team.name, team.proGoals, team.againstGoals);
        });

        console.log(this.modelTeamsGet);

        for (let index = 0; index < this.namesTeams.length; index++) {
          this.leagueChartLabels.push(this.namesTeams[index]);
        }
        console.log(this.leagueChartLabels);

        this.proGoalsTeams = res.teams.map(({ proGoals }: any) => proGoals);

        for (let index = 0; index < this.proGoalsTeams.length; index++) {
          this.leagueChartData.push(this.proGoalsTeams[index]);
        }
        console.log(this.leagueChartData);
        console.log(this.proGoalsTeams);

        this.againstGoalsTeams = res.teams.map(
          ({ againstGoals }: any) => againstGoals
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  public columnChart: GoogleChartInterface = {
    chartType: GoogleChartType.ColumnChart,
    dataTable: [
      ['Equipo', 'Goles a favor', 'Goles en contra'],
      ['Germany', 700, 1200],
      ['USA', 300, 600],
      ['Brazil', 400, 500],
      ['Canada', 500, 1000],
      ['France', 600, 1100],
      ['RU', 800, 1000],
    ],
    options: {
      title: 'Equipos',
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true,
        responsive: true,
      },
    },
  };

  /* public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.dataNameTeams,
    datasets: [
      {
        data: this.proGoalsTeams,
        label: 'Goles a favor',
        backgroundColor: 'rgba(140, 228, 131, 0.8)',
      },
      {
        data: this.againstGoalsTeams,
        label: 'Goles en contra',
        backgroundColor: 'rgba(228, 131, 131, 0.8)',
      },
    ],
  };

  // events
  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {} */
}
