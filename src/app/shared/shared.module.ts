import {NgModule} from "@angular/core";
import {NgbModalModule, NgbModule, NgbRatingModule, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BaseUrlInterceptor} from "./interceptor/base-url.interceptor";
import { PagerComponent } from './component/pager/pager.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DomainPipe } from './pipe/domain.pipe';

@NgModule( {
  declarations: [


    PagerComponent,
        DomainPipe
  ],
  imports: [
    NgbToastModule,
    NgbModalModule,
    NgbModule,
    CommonModule,
    NgbRatingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    NgbToastModule,
    NgbModalModule,
    NgbRatingModule,
    NgbModalModule,
    PagerComponent,
    ReactiveFormsModule,
    FormsModule,
    DomainPipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
  ],
  })
export class SharedModule {

}
