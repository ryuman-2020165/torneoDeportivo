import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaguesAdminComponent } from './components/admin/leagues-admin/leagues-admin.component';
import { UsersComponent } from './components/admin/users/users.component';
import { LeaguesComponent } from './components/client/leagues/leagues.component';
import { ViewLeagueComponent } from './components/client/view-league/view-league.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { UserGuard } from './guards/user.guard';
import { NgChartsModule } from 'ng2-charts';
import { MyProfileComponent } from './components/client/my-profile/my-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'myProfile', component: MyProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'viewLeague/:id', component: ViewLeagueComponent },
  { path: 'admin/users', canActivate: [UserGuard], component: UsersComponent },
  {
    path: 'admin/leagues',
    canActivate: [UserGuard],
    component: LeaguesAdminComponent,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgChartsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
