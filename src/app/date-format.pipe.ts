import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormat implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(value).toDateString();
  }

}
