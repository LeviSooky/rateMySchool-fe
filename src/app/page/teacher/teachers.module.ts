import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherComponent } from './teacher/teacher.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    TeacherListComponent,
    TeacherComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '', pathMatch: 'full', component: TeacherListComponent
            },
            {
                path: ':id', component: TeacherComponent,
            }
        ]),
        NgbTypeahead
    ],
  providers: [HttpClient]
})
export class TeachersModule { }
