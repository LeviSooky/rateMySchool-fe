import {NgModule} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {AdminUserComponent} from './admin-user/admin-user.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    AdminUserComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'users', pathMatch: 'full', component: AdminUserComponent
      },
    ]),
    NgIf,
  ]
})
export class AdminModule { }
