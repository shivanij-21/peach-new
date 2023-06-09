import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'uniqueFilter',
})
export class UniqueFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(value != ''){
    const uniqueArray = _.uniqBy(value, 'category');
    return uniqueArray;
  }
  console.log("value",value);
  
  return value;

    
  }
}
