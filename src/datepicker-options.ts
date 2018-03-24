import { Injectable } from '@angular/core';

@Injectable()
export class AngularDatepickerOptions {
    min: Date = new Date('1900/01/01 00:00:00');
    max: Date = new Date('2099/12/31 23:59:59');
    minYear: number = 1900;
    maxYear: number = 2099;
    titleFormat: string = 'y年mm月dd日';
    format: string = 'y-mm-dd hh:ii:ss';
}