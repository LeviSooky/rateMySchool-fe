import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PageRequest} from "../../model/page-request";

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent {

  @Input()
  pageReq!: PageRequest;
  @Output()
  pageReqChange = new EventEmitter<PageRequest>();

  @Output()
  pageChange = new EventEmitter<number>();

  getPageable(): PageRequest {
    return this.pageReq;
  }

  toPage(number: number) {
    this.getPageable().page = number;
    this.pageChange.emit(number);
  }

  hasNextPage() {
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 1;
  }

  hasNextNextPage() {
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 2;
  }
}
