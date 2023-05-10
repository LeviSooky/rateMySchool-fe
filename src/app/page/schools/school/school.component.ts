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
import {
  ReviewNotAcceptableModalComponent
} from "../../../shared/modal/review-not-acceptable-modal/review-not-acceptable-modal.component";
import {ReviewSuccessComponent} from "../../../shared/modal/review-success/review-success.component";
import {ResourceFailedComponent} from "../../../shared/modal/resource-failed/resource-failed.component";
import {AuthService} from "../../../shared/service/auth.service";
import {AuthUser} from "../../../shared/model/auth-user.model";
import {ModeratorService} from "../../../shared/service/moderator.service";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SchoolComponent implements OnInit {

  @ViewChild('creationModal', { static: false})
  creationModal;

@ViewChild('t') starTemplate;
  private sub = new Subscription();
  private id: string = '';

  school: School = null;
  reviews: SchoolReview[] = [];
  pageReq = new PageRequest();
  selectedSort?: Sort;
  EntityStatus = EntityStatus;

  newReview = new FormControl('', [Validators.required, Validators.minLength(10)])

  SortDirection = SortDirection;
  processingReview: boolean = false;
  creationResult: AddReviewResponse;
  wantsToChange: boolean;
  authSub: Subscription;
  user: AuthUser;
  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private reviewService: SchoolReviewService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService,
    private toastService: ToastService,
    private authService: AuthService,
    private moderatorService: ModeratorService,
  ) {}

  ngOnInit() {
    this.authService.authUser.subscribe(user => {
      this.user = user;
    });
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params['id'];
        forkJoin({
          school: this.schoolService.findBy(this.id),
          reviews: this.getReviewSearch()
        }).pipe(take(1))
          .subscribe(({school, reviews}) => {
            this.school = school;
            this.reviews = reviews;
            this.pageReq = Object.assign({} as PageRequest, this.pageReq);
        })

      });
  }

  getBaseUrl() {
    return environment.apiUrl;
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  getReviewSearch() {
    return !this.user
      ? this.reviewService.findAllActiveBy(this.id, this.pageReq)
      : this.moderatorService.findSchoolReviewsBy(this.id, this.pageReq);
  }

  getPageable() {
    return this.pageReq;
  }

  loadData() {
    this.schoolService.findBy(this.school.id)
      .pipe(take(1))
      .subscribe(res => this.school = res);
    this.searchReviews();
  }

  searchReviews() {
    this.getReviewSearch()
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

  sortReviews(event: any) {
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
    this.newReview.reset();
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true})
  }

  toDefaultImage(schoolImg: HTMLImageElement) {
    schoolImg.src = 'assets/school.jpg';
  }

  moderate(reviewId: string, shouldActivate: boolean) {
    this.moderatorService.moderateSchoolReview(reviewId, shouldActivate)
      .pipe(take(1))
      .subscribe({
        error: () => this.toastService.showError("Valami hiba történt!"),
        complete: () => {
          this.toastService.showSuccessToast(`Sikeres ${ shouldActivate ? 'aktíválás' : 'törlés'} !`);
          this.searchReviews();
        }
      })
  }

  saveReview(creationModal) {
    if (this.newReview.valid) {
      creationModal.close();
      this.spinnerService.show('spinner')
      this.reviewService.save(this.school.id, this.newReview.getRawValue())
        .pipe(take(1))
        .subscribe(result => {
          this.searchReviews();
          this.spinnerService.hide('spinner');
          this.creationResult = result;
          switch (result.status) {
            case EntityStatus.NOT_ACCEPTABLE:
              this.modalService.open(ReviewNotAcceptableModalComponent,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true})
              break;
            case EntityStatus.SENTIMENT_FAILED || EntityStatus.TRANSLATION_FAILED:
              this.modalService.open(ResourceFailedComponent,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true})
              break;
            default:
              let ngbModalRef = this.modalService.open(ReviewSuccessComponent,
                {backdrop: "static", keyboard: false, size: 'lg', animation: true, centered:true});
              ngbModalRef.componentInstance.reviewResponse = result;
              ngbModalRef.componentInstance.startTemplate = this.starTemplate;
              ngbModalRef.result.then(() => {
                this.reviewService.modifyStars(result.id, result.stars)
                  .pipe(take(1))
                  .subscribe(() => {
                    this.toastService.showSuccessToast("Sikeres módosítás!");
                    this.loadData();
                  });
              }, () => this.loadData())
              break;
          }
        }, () => this.spinnerService.hide('spinner'));
      this.newReview.reset();
    }
  }
}
