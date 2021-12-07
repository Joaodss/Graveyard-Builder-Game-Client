import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleHeaderComponent } from './components/battle-header/battle-header.component';
import { BattleUiComponent } from './components/battle-ui/battle-ui.component';
import { BattleStartComponent } from './components/battle-start/battle-start.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    BattleHeaderComponent,
    BattleUiComponent,
    BattleStartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatProgressSpinnerModule
  ]
})
export class BattleModule { }
