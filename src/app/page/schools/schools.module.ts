import {NgModule} from '@angular/core';
import {SchoolListComponent} from './school-list/school-list.component';
import {SchoolComponent} from './school/school.component';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ToastsContainer} from "../../shared/component/toast/toast-container.component";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    SchoolListComponent,
    SchoolComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '', pathMatch: 'full', component: SchoolListComponent
            },
            {
                path: ':id', component: SchoolComponent,
            }
        ]),
        ToastsContainer,
        NgxSpinnerModule,
        NgbTooltip,

    ],
  providers: [HttpClient]
})
export class SchoolsModule { }
