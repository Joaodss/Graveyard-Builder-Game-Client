import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { CharacterGridItemComponent } from './components/character-grid-item/character-grid-item.component';
import { SideDrawerComponent } from './components/side-drawer/side-drawer.component';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { HelperComponent } from './components/helper/helper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { HelpPageComponent } from './components/help-page/help-page.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
    CharacterGridItemComponent,
    SideDrawerComponent,
    CharacterDetailsComponent,
    HelperComponent,
    HelpPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
    CharacterGridItemComponent,
    SideDrawerComponent,
    CharacterDetailsComponent,
    HelperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSidenavModule
  ]
})
export class SharedModule { }
