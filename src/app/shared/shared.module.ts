import {NgModule} from "@angular/core";
import {NgbModalModule, NgbModule, NgbRatingModule, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BaseUrlInterceptor} from "./interceptor/base-url.interceptor";
import { PagerComponent } from './component/pager/pager.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DomainPipe } from './pipe/domain.pipe';
import {TokenInterceptor} from "./interceptor/token.interceptor";
import {NgxSpinnerModule} from "ngx-spinner";

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
    FormsModule,
    NgxSpinnerModule,
  ],
  exports: [
    NgbToastModule,
    NgbModalModule,
    NgbRatingModule,
    NgbModalModule,
    PagerComponent,
    ReactiveFormsModule,
    FormsModule,
    DomainPipe,
    NgxSpinnerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  })
export class SharedModule {

}
