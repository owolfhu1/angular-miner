import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-status-message',
  template: `<div [ngClass]="{highlightme: highlight}">{{ message }}</div>`,
  styles: [`
    .highlightme {
      background: #87b5fa;
      border-radius: 15px;
    }
    div {
      padding: 8px;
      margin-top: 3px;
      font-family: Chalkboard;
    }
  `]
})
export class StatusMessageComponent implements OnInit {

  @Input() message: string;
  highlight: boolean = false;

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 4; i++)
      setTimeout(() => this.highlight = !this.highlight, i * 200);
  }

}
