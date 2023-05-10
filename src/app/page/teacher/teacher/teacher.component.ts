import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageRequest} from "../../../shared/model/page-request";
import {TeacherReview} from "../../../shared/model/teacher-review";
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {TeacherReviewService} from "../../../shared/service/teacher-review.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Observable, Subscription, take} from "rxjs";
import {Sort, SortDirection} from "../../../shared/model/sort.model";
import {EntityStatus} from "../../../shared/enums/entity.status";
import {
  ReviewNotAcceptableModalComponent
} from "../../../shared/modal/review-not-acceptable-modal/review-not-acceptable-modal.component";
import {ResourceFailedComponent} from "../../../shared/modal/resource-failed/resource-failed.component";
import {ReviewSuccessComponent} from "../../../shared/modal/review-success/review-success.component";
import {FormControl, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {AddReviewResponse} from "../../../shared/model/add-review-response.model";
import {ToastService} from "../../../shared/service/toast.service";
import {AuthUser} from "../../../shared/model/auth-user.model";
import {AuthService} from "../../../shared/service/auth.service";
import {ModeratorService} from "../../../shared/service/moderator.service";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit, OnDestroy {

  @ViewChild('creationModal') private creationModal;
  @ViewChild('t') private starTemplate;
  pageReq = new PageRequest();
  private id: string;
  teacher: Teacher;
  reviews: TeacherReview[] = [];
  selectedSort: Sort;
  protected user: AuthUser;
  authSub: Subscription;
  EntityStatus = EntityStatus;
  SortDirection = SortDirection;
  newReview = new FormControl('', [Validators.required, Validators.minLength(10)]);
  private creationResult: AddReviewResponse;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private reviewService: TeacherReviewService,
    private router: Router,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private toastService: ToastService,
    private authService: AuthService,
    private moderatorService: ModeratorService,
  ) {
  }

  ngOnInit(): void {
    this.authSub = this.authService.authUser.subscribe(user => this.user = user);
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params['id'];
        forkJoin({
          teacher: this.teacherService.findBy(this.id),
          reviews: this.getReviewSearch(this.id)
        }).pipe(take(1))
          .subscribe(({teacher, reviews}) => {
            this.teacher = teacher;
            this.reviews = reviews;
            this.pageReq = Object.assign({} as PageRequest, this.pageReq);
          })

      });
  }

  searchReviews() {
    this.getReviewSearch(this.id)
      .pipe(take(1))
      .subscribe(result => {
        this.reviews = result;
        this.pageReq = Object.assign({} as PageRequest, this.pageReq);
      });
  }

  private getReviewSearch(teacherId: string): Observable<TeacherReview[]> {
    return this.user
      ? this.moderatorService.findTeacherReviewsBy(teacherId, this.pageReq)
      : this.reviewService.findAllActiveBy(teacherId, this.pageReq);
  }


  openCreationModal() {
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true, centered:true})
  }

  sortReview(event: any) {
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

  toSchool(id: string) {
    this.router.navigate(['/schools/', id]);
  }

  loadData() {
    this.teacherService.findBy(this.teacher.id)
      .pipe(take(1))
      .subscribe(res => this.teacher = res);
    this.searchReviews();
  }

  saveReview(modal: any) {
    if (this.newReview.valid) {
      modal.close();
      this.spinnerService.show('spinner')
      this.reviewService.save(this.teacher.id, this.newReview.getRawValue())
        .pipe(take(1))
        .subscribe(result => {
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

  moderate(reviewId: string, shouldActivate: boolean) {
    this.moderatorService.moderateTeacherReview(reviewId, shouldActivate)
      .pipe(take(1))
      .subscribe({
        error: () => this.toastService.showError("Valami hiba történt!"),
        complete: () => {
          this.toastService.showSuccessToast(`Sikeres ${ shouldActivate ? 'aktíválás' : 'törlés'} !`);
          this.searchReviews();
        }
      })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
