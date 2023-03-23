import {NgModule} from "@angular/core";
import {
  NgbActiveModal,
  NgbModalModule,
  NgbModule,
  NgbRatingModule,
  NgbToastModule,
  NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {BaseUrlInterceptor} from "./interceptor/base-url.interceptor";
import {PagerComponent} from './component/pager/pager.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DomainPipe} from './pipe/domain.pipe';
import {TokenInterceptor} from "./interceptor/token.interceptor";
import {NgxSpinnerModule} from "ngx-spinner";
import {
  ReviewNotAcceptableModalComponent
} from "./modal/review-not-acceptable-modal/review-not-acceptable-modal.component";
import { ReviewSuccessComponent } from './modal/review-success/review-success.component';
import { ResourceFailedComponent } from './modal/resource-failed/resource-failed.component';

@NgModule( {
    declarations: [
        PagerComponent,
        DomainPipe,
        ReviewNotAcceptableModalComponent,
        ReviewSuccessComponent,
        ResourceFailedComponent,
    ],
  imports: [
    CommonModule,
    NgbToastModule,
    NgbModalModule,
    NgbModule,
    NgbRatingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgbTooltip,
  ],
  exports: [
    CommonModule,
    NgbToastModule,
    NgbModalModule,
    NgbRatingModule,
    NgbModalModule,
    NgbTooltip,
    PagerComponent,
    ReactiveFormsModule,
    FormsModule,
    DomainPipe,
    NgxSpinnerModule,
    ReviewNotAcceptableModalComponent,
    ReviewSuccessComponent,
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
    NgbActiveModal,
  ],
  })
export class SharedModule {

}
