import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-status',
  template: `
    <div class="window" #scroll>
      <p><b></b></p>
      <span *ngFor="let message of messages; let i = index">
        <app-status-message [message]="message" ></app-status-message>
      </span>
    </div>
  `,
  styles: [`.window{text-align: left;}`]
})
export class StatusComponent implements OnInit {

  @ViewChild('scroll') scrollDiv: ElementRef;
  messages: string[] = [];

  constructor(private statsService:StatsService) { }

  ngOnInit() {
    this.messages.push(this.statsService.getStatus());
    this.statsService.statusUpdate.subscribe(message => {
      if (this.messages.length > 100)
        this.messages.splice(0, 1);
      this.messages.push(message);
    });
  }

  ngAfterViewChecked() {
    this.scrollDiv.nativeElement.scrollTop = this.scrollDiv.nativeElement.scrollHeight;
  }

}
