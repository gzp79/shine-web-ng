import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentUserDetailComponent } from './current-user-detail.component';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent,
    CurrentUserDetailComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoginComponent,
    CurrentUserDetailComponent
  ]
})
export class IdentityModule {
}
