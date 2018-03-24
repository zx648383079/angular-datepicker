import { Component, OnInit, OnChanges, Input, EventEmitter, Output, HostListener, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { IDay, DayMode } from './datepicker.base';
import { AngularDatepickerOptions } from 'datepicker-options';

@Component({
    selector: 'datepicker-component',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, OnChanges {
    @Input() min: Date = new Date('1900/01/01 00:00:00');
    @Input() max: Date = new Date('2099/12/31 23:59:59');
    @Input() minYear: number = 1900;
    @Input() maxYear: number = 2099;
    @Input() titleFormat: string = 'y年mm月dd日';
    @Input() format: string = 'y-mm-dd hh:ii:ss';
    @Input('value') currentDate: Date = new Date();

    @Output() valueChange: EventEmitter<string> = new EventEmitter();

    @HostListener('document:click', ['$event']) hideCalendar(event) {
        if(!event.target.closest('.datepicker') && !this.hasElementByClass(event.path, 'datepicker__calendar')) {
            this.calendarVisible = false;
        }
    }

    title: string = '-';

    day_list: Array<IDay> = [];

    year_list: Array<number> = [];

    month_list: Array<number> = [];

    hour_list: Array<number> = [];

    minute_list: Array<number> = [];

    second_list: Array<number> = [];
    
    currentYear: number;

    currentMonth: number;

    currentDay: number;

    currentHour: number;

    currentMinute: number;

    currentSecond: number;

    hasTime: boolean = true;

    calendarVisible: boolean = false;

    gridMode: DayMode = DayMode.Day;

    constructor(opts: AngularDatepickerOptions) {
        this.min = opts.min;
        this.max = opts.max;
        this.maxYear = opts.maxYear;
        this.minYear = opts.minYear;
        this.format = opts.format;
        this.titleFormat = opts.titleFormat
    }

    ngOnInit() { 
        this.refresh();
        this.initMonths();
        this.initYears();
        if (this.hasTime) {
            this.initHours();
            this.initMinutes();
            this.initSeconds();
        }
        this.output();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.format) {
            this.hasTime = changes.format.currentValue.indexOf('h') > 0;
        }
        if (changes.currentDate) {
            this.currentDate = this.parseDate(changes.currentDate.currentValue);
        }
        if (changes.min) {
            this.min = this.parseDate(changes.min.currentValue);
            if (!this.hasTime) {
                this.min.setHours(23, 59, 59, 999);
            } else {
                this.min.setMilliseconds(999);
            }
            if (this.min >= this.currentDate) {
                // 加一天
                this.currentDate = new Date(this.min.getTime() + 86400000);
                
            }
        }
        if (changes.max) {
            this.max = this.parseDate(changes.max.currentValue);
            if (!this.hasTime) {
                this.max.setHours(0, 0, 0, 0);
            }
        }
        this.refresh();
    }

    /**
     * 转化date
     * @param date 
     */
    parseDate(date: any): Date {
        if (!date) {
            return new Date();
        }
        if (typeof date == 'number') {
            return new Date(date * 1000);
        } 
        if (typeof date == 'string') {
            return new Date(date);
        }
        return date;
    }

    /**
      * 验证Date
      * @param date 
      */
     checkDate(date: Date): boolean {
        let min = this.min;
        if (min && date <= min) {
            return false;
        }
        let max = this.max;
        return !max || date < max;
    }

    /**
     * 刷新变化部分
     */
    refresh() {
        this.hasTime = this.format.indexOf('h') > 0;
        this.refreshCurrent();
        this.initDays();
    }

    refreshCurrent() {
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth() + 1;
        this.currentDay = this.currentDate.getDate();
        if (this.hasTime) {
            this.currentHour = this.currentDate.getHours();
            this.currentMinute = this.currentDate.getMinutes();
            this.currentSecond = this.currentDate.getSeconds();
        }
        this.title = this.formatDate(this.currentDate, this.titleFormat);
    }

    initHours() {
        this.hour_list = [];
        for (let i = 0; i < 24; i++) {
            this.hour_list.push(i);
        }
    }

    initMinutes() {
        this.minute_list = [];
        for (let i = 0; i < 60; i++) {
            this.minute_list.push(i);
        }
    }

    initSeconds() {
        this.second_list = [];
        for (let i = 0; i < 60; i++) {
            this.second_list.push(i);
        }
    }

    initMonths() {
        this.month_list = [];
        for (let i = 1; i < 13; i++) {
            this.month_list.push(i);
        }
    }

    initYears() {
        this.year_list = [];
        for(let i = this.minYear; i <= this.maxYear; i++) {
            this.year_list.push(i);
        }
    }

    initDays() {
        this.day_list = this.getDaysOfMonth(this.currentMonth, this.currentYear);
    }

    toggleYear() {
        this.gridMode = this.gridMode == DayMode.Year ? DayMode.Day : DayMode.Year;
    }

    toggleTime() {
        this.gridMode = this.gridMode == DayMode.Hour ? DayMode.Day : DayMode.Hour;
    }


    private getDaysOfMonth(m: number, y: number): Array<IDay> {
        let days = [];
        let [f, c] = this.getFirtAndLastOfMonth(y, m);
        let i: number;
        if (f > 0) {
            let yc = this.getLastOfMonth(y, m - 1);
            for (i = yc - f + 2; i <= yc; i ++) {
                days.push({
                    disable: true,
                    val: i
                });
            }
        }
        for (i = 1; i <= c; i ++) {
            days.push({
                disable: false,
                val: i
            });
        }
        if (f + c < 43) {
            let l = 42 - f - c + 1;
            for (i = 1; i <= l; i ++) {
                days.push({
                    disable: true,
                    val: i
                });
            }
        }
        return days;
    }

    /**
     * 获取月中最后一天
     * @param y 
     * @param m 
     */
    private getLastOfMonth(y: number, m: number): number {
        let date = new Date(y, m, 0);
        return date.getDate();
     }

    /**
     * 获取第一天和最后一天
     * @param y 
     * @param m 
     */
    private getFirtAndLastOfMonth(y: number, m: number): [number, number] {
        let date = new Date(y, m, 0);
        let count = date.getDate();
        date.setDate(1);
        return [date.getDay(), count];
     }

    /**
     * 上一年
     */
    previousYear() {
        this.changeYear(this.currentYear - 1);
    }
    /**
     * 下一年
     */
    nextYear() {
        this.changeYear(this.currentYear + 1);
    }
    /**
     * 上月
     */
    previousMonth() {
        this.changeMonth(this.currentMonth - 1);
    }
    /**
     * 下月
     */
    nextMonth() {
        this.changeMonth(this.currentMonth + 1);
    }

    applyCurrent() {
        this.currentDate.setFullYear(this.currentYear, this.currentMonth, this.currentDay);
        if (this.hasTime) {
            this.currentDate.setHours(this.currentHour, this.currentMinute, this.currentSecond);
        }
        this.title = this.formatDate(this.currentDate, this.titleFormat);
    }

    changeYear(year: number) {
        this.currentYear = year;
        this.initDays();
        this.applyCurrent();
    }

    changeMonth(month: number) {
        this.currentMonth = month;
        this.initDays();
        this.applyCurrent();
    }

    changeDay(day: IDay) {
        let date = new Date(this.currentDate.getTime());
        if (day.disable) {
            if (day.val < 15) {
                date.setMonth(date.getMonth() + 1);
            } else {
                date.setMonth(date.getMonth() - 1);
            }
        }
        date.setDate(day.val);
        if (!this.checkDate(date)) {
            return;
        }
        this.currentDate = date;
        this.refreshCurrent();
        if (!this.hasTime) {
            this.enterChange();
            return;
        }
    }

    changeHour(hour: number) {
        this.currentHour = hour;
    }

    changeMinute(minute: number) {
        this.currentMinute = minute;
    }

    changeSecond(second: number) {
        this.currentSecond = second;
    }

    /**
     * 确认改变
     */
    enterChange() {
        this.applyCurrent();
        if (!this.checkDate(this.currentDate)) {
            return;
        }
        this.output();
        this.calendarVisible = false;
    }

    output() {
        this.valueChange.emit(this.formatDate(this.currentDate, this.format));
    }

    showCalendar() {
        this.calendarVisible = true;
        this.refresh();
    }

    /**
     * 格式化日期
     */
    public formatDate(date: Date, fmt: string = 'y年mm月dd日'): string {
        let o = {
            "y+": date.getFullYear(),
            "m+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "i+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒 
        };
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }


    hasElementByClass(path: Array<Element>, className: string): boolean {
        let hasClass = false;
        for (let i = 0; i < path.length; i++) {
            const item = path[i];
            if (!item || !item.className) {
                continue;
            }
            hasClass = item.className.indexOf(className) >= 0;
            if (hasClass) {
                return true;
            }
        }
        return hasClass;
    }
}