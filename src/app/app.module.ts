import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { HomeModule } from './modules/home/home.module';
import { PartyModule } from './modules/party/party.module';
import { GraveyardModule } from './graveyard/graveyard.module';
import { BattleModule } from './modules/battle/battle.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AuthenticationModule,
    HomeModule,
    PartyModule,
    GraveyardModule,
    BattleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
