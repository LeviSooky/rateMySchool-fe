import {NgModule} from "@angular/core";
import {NgbModalModule, NgbModule, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BaseUrlInterceptor} from "./interceptor/base-url.interceptor";

@NgModule( {
  declarations: [

  ],
  imports: [
    NgbToastModule,
    NgbModalModule,
    NgbModule,

  ],
  exports: [
    NgbToastModule,
    NgbModalModule
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
