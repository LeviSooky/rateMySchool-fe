import {NgModule} from "@angular/core";
import {NgbModalModule, NgbModule, NgbRatingModule, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BaseUrlInterceptor} from "./interceptor/base-url.interceptor";
import { PagerComponent } from './component/pager/pager.component';
import {CommonModule} from "@angular/common";

@NgModule( {
  declarations: [


    PagerComponent
  ],
  imports: [
    NgbToastModule,
    NgbModalModule,
    NgbModule,
    CommonModule,
    NgbRatingModule
  ],
  exports: [
    NgbToastModule,
    NgbModalModule,
    NgbRatingModule,
    NgbModalModule,
    PagerComponent,
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
