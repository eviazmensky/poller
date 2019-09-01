import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Polling POC';
  showTest = true;
  showExample = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
