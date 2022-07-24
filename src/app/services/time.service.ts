import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {
  constructor() { }

  getTimeLeft(date: Date|string): string {
    const currentDate = new Date().getTime();
    const dueDate = new Date(date).getTime();
    // get total seconds between the times
    let delta = Math.abs(dueDate - currentDate) / 1000;
    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const difference = dueDate - currentDate;
    if (difference >= 0) {
      return days + 'd ' + hours + 'h ' + minutes + 'min';
    } else {
      return 'none';
    }
  }
}
