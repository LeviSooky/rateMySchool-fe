import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherComponent } from './teacher/teacher.component';



@NgModule({
  declarations: [
    TeacherListComponent,
    TeacherComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TeachersModule { }
