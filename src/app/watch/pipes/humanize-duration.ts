import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'humanizeDuration'
})
export class HumanizeDurationPipe implements PipeTransform {
  transform(value: number) {
    return moment.duration(value, 'seconds').humanize();
  }
}