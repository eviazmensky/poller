import { Component, OnInit, OnDestroy } from '@angular/core';
import {IntervalService} from '../interval.service';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css'],
  providers: [IntervalService]
})
export class TesterComponent implements OnInit, OnDestroy {

  constructor(private intervalService: IntervalService) {
  }

  ngOnInit(): void {
    this.intervalService.startInterval('abc');
    setTimeout(
      () => this.intervalService.startInterval(['zzz', '123']), 3000
    );
  }

  getData(key: string) {
    this.intervalService.getData(key);
  }

  ngOnDestroy(): void {
    console.log('destroy!');
  }

  cancel(key: string = '') {
    if (!!key) {
      this.intervalService.cancelInterval(key);
    } else {
      this.intervalService.cancelAll();
    }
  }

  start(key) {
    if (key) {
      this.intervalService.startInterval(key);
    }
  }
}
