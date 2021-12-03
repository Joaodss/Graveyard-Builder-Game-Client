import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyListComponent } from '../party/components/party-list/party-list.component';
import { CharacterCreatorComponent } from '../party/components/character-creator/character-creator.component';


@NgModule({
  declarations: [
    PartyListComponent,
    CharacterCreatorComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PartyModule { }
