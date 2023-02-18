import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TeacherListComponent} from "./teacher-list/teacher-list.component";
import {TeacherComponent} from "./teacher/teacher.component";

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: TeacherListComponent
  },
  {
    path: '/:id', component: TeacherComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule {

}
