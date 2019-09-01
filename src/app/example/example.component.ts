import {Component, OnDestroy, OnInit} from '@angular/core';
import {IntervalService} from '../interval.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
  providers: [IntervalService]
})
export class ExampleComponent implements OnInit {

  constructor(private intervalService: IntervalService) {
  }

  ngOnInit() {
  }

  // ngOnDestroy(): void {
  //   console.log('example component destroy!');
  // }

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
