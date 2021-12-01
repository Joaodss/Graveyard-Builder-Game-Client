import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { CharacterGridComponent } from './components/character-grid/character-grid.component';
import { CharacterGridItemComponent } from './components/character-grid-item/character-grid-item.component';
import { SideDrawerComponent } from './components/side-drawer/side-drawer.component';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { HelperComponent } from './components/helper/helper.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
    CharacterGridComponent,
    CharacterGridItemComponent,
    SideDrawerComponent,
    CharacterDetailsComponent,
    HelperComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
    CharacterGridComponent,
    CharacterGridItemComponent,
    SideDrawerComponent,
    CharacterDetailsComponent,
    HelperComponent
  ]
})
export class SharedModule { }