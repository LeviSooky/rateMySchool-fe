import {Component, OnInit} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {

  keyword: string = '';
  schools: School[] = [];
  private pageRequest: PageRequest = PageRequest.DEFAULT;
  constructor(private schoolService: SchoolService) {
  }
  ngOnInit(): void {
    this.schoolService.findAll(this.pageRequest)
      .pipe(take(1))
      .subscribe(result => {
        console.log("hello", result)
        this.schools = result;
    })
  }

  getPageable(): PageRequest {
    return this.pageRequest;
  }

  search(): void {
    this.keyword === '' ?
      this.schoolService.findAll(this.getPageable())
        .pipe(take(1))
        .subscribe(result => this.schools = result)
      : this.schoolService.findAllBy(this.keyword, this.getPageable())
        .pipe(take(1))
        .subscribe(result => this.schools = result)  }

  openSchool(index: number) {
    //TODO implement
  }

  hasNextPage(): boolean {
    // @ts-ignore
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page;
  }

  hasNextNextPage(): boolean { //TODO rename
    // @ts-ignore
    return this.getPageable()?.totalPages && this.getPageable().totalPages > this.getPageable()?.page + 1;
  }
}
