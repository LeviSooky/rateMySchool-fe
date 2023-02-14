import {Sort} from "./sort.model";

export class PageRequest {

  static readonly DEFAULT = new PageRequest(0, 250, []);
  static readonly TOTAL_ELEMENTS_HEADER = 'totalElements';
  static readonly TOTAL_PAGES_HEADER = 'totalPages';
  constructor
  (
    public page: number,
    public size: number,
    public sort: Sort[],
    // @ts-ignore

    public totalElements?: number | unknown,
    // @ts-ignore

    public totalPages?: number | unknown,
  ) {}

  setSort(sort: Sort): void {
    this.sort ? this.sort.push(sort) : this.sort = [sort];
  }

  nextPage(): PageRequest {
    this.page ++;
    return this;
  }

  previousPage(): PageRequest {
    if (this.page > 0) {
      this.page--;
    }
    return this;
  }

  clearSort(): void {
    this.sort = [];
  }
}
