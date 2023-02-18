import {NgModule} from '@angular/core';
import {SchoolListComponent} from './school-list/school-list.component';
import {SchoolComponent} from './school/school.component';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild([
        {
          path: '', pathMatch: 'full', component: SchoolListComponent
        },
        {
          path: ':id', component: SchoolComponent,
        }
      ]),

    ],
  providers: [HttpClient]
})
export class SchoolsModule { }
