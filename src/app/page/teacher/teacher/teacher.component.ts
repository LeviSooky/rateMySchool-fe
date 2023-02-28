import {Component, OnInit} from '@angular/core';
import {PageRequest} from "../../../shared/model/page-request";
import {TeacherReview} from "../../../shared/model/teacher-review";
import {Teacher} from "../../../shared/model/teacher.model";
import {TeacherService} from "../../../shared/service/teacher.service";
import {TeacherReviewService} from "../../../shared/service/teacher-review.service";
import {ActivatedRoute} from "@angular/router";
import {forkJoin, take} from "rxjs";
import {Sort, SortDirection} from "../../../shared/model/sort.model";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  pageReq = new PageRequest();
  private id: string;
  teacher: Teacher;
  reviews: TeacherReview[] = [];
  selectedSort: Sort;
  SortDirection = SortDirection;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private teacherReviewService: TeacherReviewService,
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.id = params['id'];
        forkJoin({
          teacher: this.teacherService.findBy(this.id),
          reviews: this.teacherReviewService.findAllActiveBy(this.id, this.pageReq)
        }).pipe(take(1))
          .subscribe(({teacher, reviews}) => {
            this.teacher = teacher;
            this.reviews = reviews;
            this.pageReq = Object.assign({} as PageRequest, this.pageReq);
          })

      });
  }

  searchReviews() {
    this.teacherReviewService.findAllActiveBy(this.teacher.id, this.pageReq)
      .pipe(take(1))
      .subscribe(result => {
        this.reviews = result;
        this.pageReq = Object.assign({} as PageRequest, this.pageReq);
      });
  }

  openCreationModal() {

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

}
