import { Component, OnInit } from '@angular/core';
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-status',
  template: `
    <div class="window">
      <p><b></b></p>
      <p *ngFor="let message of messages; let i = index">
        <b *ngIf="i === 0">{{ message }}</b>
        <span *ngIf="i > 0">{{ message }}</span>
      </p>
    </div>
  `,
  styles: [`.window{text-align: left;}`]
})
export class StatusComponent implements OnInit {

  messages: string[] = [];

  constructor(private statsService:StatsService) { }

  ngOnInit() {
    this.messages.push(this.statsService.getStatus());
    this.statsService.statusUpdate.subscribe(message => {
      this.messages = [message, ...this.messages];
    });
  }

}
