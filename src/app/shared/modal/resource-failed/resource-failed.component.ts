import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-resource-failed',
  templateUrl: './resource-failed.component.html',
  styleUrls: ['./resource-failed.component.scss']
})
export class ResourceFailedComponent {

  constructor(protected activeModal: NgbActiveModal) {
  }
}
