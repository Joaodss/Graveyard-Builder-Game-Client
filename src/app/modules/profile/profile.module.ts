import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { PasswordFormComponent } from './components/password-form/password-form.component';


@NgModule({
  declarations: [
    ProfileDetailsComponent,
    PasswordFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProfileModule { }
