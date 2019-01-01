import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-status-message',
  template: `<div [ngClass]="{highlightme: highlight, otherhighlight: other}">{{ message }}</div>`,
  styles: [`
    .highlightme {
      background: #c4379a;
      border-radius: 15px;
    }

    .otherhighlight {
      background: #28c42d;
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
  @Input() last: boolean;
  highlight: boolean = false;
  other: boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.last) {
      for (let i = 0; i < 20; i++)
        setTimeout(() => this.highlight = !this.highlight, 45 * i);
      setTimeout(() => {
        for (let i = 0; i < 20; i++)
          setTimeout(() => this.other = !this.other, 45 * i);
      }, 30)

    }
  }

}
