import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {forkJoin, Subscription, take} from "rxjs";
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {SchoolReviewService} from "../../../shared/service/school-review.service";
import {PageRequest} from "../../../shared/model/page-request";
import {SchoolReview} from "../../../shared/model/school-review.model";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../../../environments/environment";
import {FormControl, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SchoolComponent implements OnInit {

  @ViewChild('creationModal', { static: false})
    // @ts-ignore
  creationModal;

  private sub = new Subscription();
  private id: string = '';

  currentRate = 3.16; //TODO remove
  // @ts-ignore
  school: School = null;
  reviews: SchoolReview[] = []; //TODO change it
  pageReq = new PageRequest();
  selectedSort?: Sort;
  openedReview: SchoolReview;

  newReview = new FormControl('', [Validators.required, Validators.minLength(10)])

  SortDirection = SortDirection;
  processingReview: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private reviewService: SchoolReviewService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params['id'];
        forkJoin({
          school: this.schoolService.findBy(this.id),
          reviews: this.reviewService.findAllActiveBy(this.id, this.pageReq)
        }).pipe(take(1))
          .subscribe(({school, reviews}) => {
            this.school = school;
            this.reviews = reviews;
            this.pageReq = Object.assign({} as PageRequest, this.pageReq);
        })

      });
  }

  getByRating(): string {
    return '';//TODO
  }

  getBaseUrl() {
    return environment.apiUrl;
  }

  getPageable() {
    return this.pageReq;
  }

  searchReviews() {
    this.reviewService.findAllActiveBy(this.school.id, this.getPageable())
      .pipe(take(1))
      .subscribe(result => {
        this.reviews = result;
        this.pageReq = Object.assign({} as PageRequest, this.pageReq);
      });
  }

  sort(field: string, direction: SortDirection) {
    let sort = new Sort(field, direction);
    this.pageReq.sort = [sort];
    this.selectedSort = sort;
    this.searchReviews();
  }

  sortA(event: any) {
    let sort: Sort;
    switch (Number.parseInt(event.target.value)) {
      case 0:
        return;
      case 1:
        sort = new Sort('stars', SortDirection.ASC);
        break;
      case 2:
        sort = new Sort('stars', SortDirection.DESC);
        break;
      case 3:
        sort = new Sort('creationDate', SortDirection.ASC);
        break;
      case 4:
        sort = new Sort('creationDate', SortDirection.DESC);
        break;
    }
    // @ts-ignore
    this.pageReq.sort = [sort];
    this.searchReviews();
  }

  openCreationModal() {
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true})
  }

  toDefaultImage(schoolImg: HTMLImageElement) {
    schoolImg.src = 'assets/school.jpg';
  }

  saveReview(creationModal) {
    if (this.newReview.valid) {
      creationModal.close();
      this.spinnerService.show('spinner')
      this.reviewService.save(this.school.id, this.newReview.getRawValue())
        .pipe(take(1))
        .subscribe(result => {
          this.spinnerService.hide('spinner')
        }, () => this.spinnerService.hide('spinner')); //TODO
      this.newReview.reset();
    }
  }
}
