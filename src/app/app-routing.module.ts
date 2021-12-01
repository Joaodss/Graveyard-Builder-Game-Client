import { ProfileDetailsComponent } from './modules/profile/components/profile-details/profile-details.component';
import { GraveyardListComponent } from './modules/graveyard/components/graveyard-list/graveyard-list.component';
import { PartyListComponent } from './modules/party/components/party-list/party-list.component';
import { HomeComponent } from './modules/home/components/home/home.component';
import { MenuComponent } from './modules/home/components/menu/menu.component';
import { RegisterComponent } from './modules/authentication/components/register/register.component';
import { LoginComponent } from './modules/authentication/components/login/login.component';
import { HomeModule } from './modules/home/home.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileDetailsComponent },
  // { path: 'battle', component:  },
  { path: 'party', component: PartyListComponent },
  { path: 'graveyard', component: GraveyardListComponent },
  // { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
