import {Component, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-review-not-acceptable-modal',
  templateUrl: './review-not-acceptable-modal.component.html',
  styleUrls: ['./review-not-acceptable-modal.component.scss']
})
export class ReviewNotAcceptableModalComponent {

  constructor(protected activateModal: NgbActiveModal) {
  }

}
