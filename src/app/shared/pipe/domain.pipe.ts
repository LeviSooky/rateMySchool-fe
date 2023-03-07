import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'domain'
})
export class DomainPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value?.split('/').find(subStr => subStr.includes('.'));
  }

}
