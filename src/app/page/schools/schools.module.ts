import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolComponent } from './school/school.component';



@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SchoolsModule { }
