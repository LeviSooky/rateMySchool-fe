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
import {EntityStatus} from "../../../shared/enums/entity.status";
import {AddReviewResponse} from "../../../shared/model/add-review-response.model";
import {ToastService} from "../../../shared/service/toast.service";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SchoolComponent implements OnInit {

  @ViewChild('creationModal', { static: false})
  creationModal;

  @ViewChild('failedModal', { static: false})
  failedModal;

  @ViewChild('resourceFailed', { static: false})
  resourceFailed;
  @ViewChild('saveSuccess', { static: false})
  saveSuccess;

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
  creationResult: AddReviewResponse;
  wantsToChange: boolean;
  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private reviewService: SchoolReviewService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService,
    private toastService: ToastService,
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
          this.spinnerService.hide('spinner');
          this.creationResult = result;
          switch (result.status) {
            case EntityStatus.NOT_ACCEPTABLE:
              this.modalService.open(this.failedModal,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true})
              break;
            case EntityStatus.SENTIMENT_FAILED || EntityStatus.TRANSLATION_FAILED:
              this.modalService.open(this.resourceFailed,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true})
              break;
            default:
              this.modalService.open(this.saveSuccess,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true})
                .result.then(res => {
                if (res) {
                  this.reviewService.modifyStars(result.id, result.stars)
                    .pipe(take(1))
                    .subscribe(() => this.toastService.showSuccessToast("Sikeres m??dos??t??s!"));
                }
              }, () => {})
              break;
          }
        }, () => this.spinnerService.hide('spinner')); //TODO
      this.newReview.reset();
    }
  }

  changeStars() {
    this.wantsToChange = true;
  }
}
