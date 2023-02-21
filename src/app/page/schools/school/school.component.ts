import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {forkJoin, Subscription, take} from "rxjs";
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {SchoolReviewService} from "../../../shared/service/school-review.service";
import {PageRequest} from "../../../shared/model/page-request";
import {SchoolReview} from "../../../shared/model/school-review.model";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  private sub = new Subscription();
  private id: string = '';

  currentRate = 3.16; //TODO remove
  // @ts-ignore
  school: School = null;
  reviews: SchoolReview[] = []; //TODO change it
  pageReq = PageRequest.DEFAULT;
  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private reviewService: SchoolReviewService
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
        })

      });
  }

  getByRating(): string {
    return '';//TODO
  }

  getPageable() {
    return this.pageReq;
  }

  hasNextPage() {
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 1;
  }

  hasNextNextPage() {
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 2;
  }

  toPage(pageNumber: number) {
    this.getPageable().page = pageNumber;
    this.searchReviews();
  }

  searchReviews() {
    this.reviewService.findAllActiveBy(this.school.id, this.getPageable())
      .pipe(take(1))
      .subscribe(result => this.reviews = result);
  }
}
