import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class Reverse implements PipeTransform {

  transform(value: any, args?: any): any {
    var copy = value.slice();
    return copy.reverse();
  }

}
