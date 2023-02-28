import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavBarComponent} from './shared/component/nav-bar/nav-bar.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {ToastsContainer} from "./shared/component/toast/toast-container.component";

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    NgbModule,
    ToastsContainer
  ],
  providers: [
    HttpClient,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
