import {Component, OnInit} from '@angular/core';
import {SchoolService} from "../../../shared/service/school.service";
import {School} from "../../../shared/model/school.model";
import {PageRequest} from "../../../shared/model/page-request";
import {take} from "rxjs";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit {

  keyword: string = '';
  schools: School[] = [];
  pageRequest: PageRequest = PageRequest.DEFAULT;
  constructor(private schoolService: SchoolService) {
  }
  ngOnInit(): void {
    this.schoolService.findAll(this.pageRequest)
      .pipe(take(1))
      .subscribe(result => {
        this.schools = result;
    })
  }

  search(): void {
    //TODO implement
  }

}
