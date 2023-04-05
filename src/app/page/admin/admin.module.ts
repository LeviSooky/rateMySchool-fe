import {NgModule} from '@angular/core';
import {NgIf} from '@angular/common';
import {AdminUserComponent} from './admin-user/admin-user.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {AuthGuard} from "../../shared/model/auth.guard";


@NgModule({
  declarations: [
    AdminUserComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'users', pathMatch: 'full', component: AdminUserComponent, canActivate: [AuthGuard],
      },
      {
        path: '*', redirectTo: 'users',
      }
    ]),
    NgIf,
  ]
})
export class AdminModule { }
