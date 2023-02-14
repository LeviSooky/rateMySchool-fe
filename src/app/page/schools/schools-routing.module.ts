import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SchoolListComponent} from "./school-list/school-list.component";
import {SchoolComponent} from "./school/school.component";

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: SchoolListComponent
  },
  {
    path: '/:id', component: SchoolComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SchoolsRoutingModule {

}
