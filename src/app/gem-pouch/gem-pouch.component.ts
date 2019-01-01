import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { Gem } from "../models/gem.model";

@Component({
  selector: 'app-gem-pouch',
  template: `
    <div class="window">
      <h1>Gem Pouch</h1>
      <p *ngIf="gems.length === 0">Your gem pouch is currently empty, try mining for coins and you may find some.</p>
      <ul>
        <li *ngFor="let gem of gems; let i = index">
          {{gem.cut ? '' : 'uncut'}} {{ gem.type }} <button (click)="sellGem(i)">sell({{ gem.price }})</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`    
  `]
})
export class GemPouchComponent implements OnInit {

  gems: Gem[];

  constructor(private statsService: StatsService) {
  }

  ngOnInit() {
    this.gems = this.statsService.getGemPouch();
    this.statsService.gemPouchUpdate.subscribe(gems => this.gems = gems);
  }

  sellGem = (index: number) => this.statsService.sellGem(index);

}
