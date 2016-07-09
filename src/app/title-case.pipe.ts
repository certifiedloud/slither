import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})
export class TitleCase implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.length > 0 ? value.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() )) : '';
  }

}
