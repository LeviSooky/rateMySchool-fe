import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddReviewResponse} from "../../model/add-review-response.model";

@Component({
  selector: 'app-review-success',
  templateUrl: './review-success.component.html',
  styleUrls: ['./review-success.component.scss']
})
export class ReviewSuccessComponent {

  @Input()
  reviewResponse: AddReviewResponse;

  @Input()
  startTemplate;

  @Output()
  starChange = new EventEmitter<number>();

  wantsToChange: boolean = false;

  constructor(protected activeModal: NgbActiveModal) {
  }

}
