import {Component, OnInit, ViewChild} from '@angular/core';
import {PageRequest} from "../../../shared/model/page-request";
import {TeacherReview} from "../../../shared/model/teacher-review";
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {TeacherReviewService} from "../../../shared/service/teacher-review.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, take} from "rxjs";
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

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

  @ViewChild('creationModal') private creationModal;
  @ViewChild('t') private starTemplate;
  pageReq = new PageRequest();
  private id: string;
  teacher: Teacher;
  reviews: TeacherReview[] = [];
  selectedSort: Sort;
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
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params['id'];
        forkJoin({
          teacher: this.teacherService.findBy(this.id),
          reviews: this.reviewService.findAllActiveBy(this.id, this.pageReq)
        }).pipe(take(1))
          .subscribe(({teacher, reviews}) => {
            this.teacher = teacher;
            this.reviews = reviews;
            this.pageReq = Object.assign({} as PageRequest, this.pageReq);
          })

      });
  }

  searchReviews() {
    this.reviewService.findAllActiveBy(this.teacher.id, this.pageReq)
      .pipe(take(1))
      .subscribe(result => {
        this.reviews = result;
        this.pageReq = Object.assign({} as PageRequest, this.pageReq);
      });
  }

  openCreationModal() {
    this.modalService.open(this.creationModal,
      {backdrop: "static", keyboard: false, size: 'xl', animation: true})
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
                    this.refreshReviews();
                  });
              }, () => this.refreshReviews())
              break;
          }
        }, () => this.spinnerService.hide('spinner')); //TODO
      this.newReview.reset();
    }
  }

  private refreshReviews() {
    this.reviewService.findAllActiveBy(this.teacher.id, this.pageReq)
      .pipe(take(1))
      .subscribe(result => this.reviews = result);
  }
}
