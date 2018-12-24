import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";

@Component({
  selector: 'app-stats',
  template: `
    <div>
      <p>Life points: {{ lifePoints }}/{{ maxLifePoints }}</p>
      <p>Gems in Gem Pouch: {{ gems }}</p>
      <p>Coins: {{ coins }}</p>
      <p>status: {{ status }}</p>
    </div>
  `,
  styles: [`
  
  `]
})
export class StatsComponent implements OnInit {

  lifePoints: number;
  maxLifePoints: number;
  gems: number;
  coins: number;
  status: string;

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.lifePoints = this.statsService.getLifePoints();
    this.maxLifePoints = this.statsService.getMaxLifePoints();
    this.gems = this.statsService.getGemPouch().length;
    this.coins = this.statsService.getCoins();
    this.status = this.statsService.getStatus();
    this.statsService.lifePointsUpdate.subscribe(life => this.lifePoints = life);
    this.statsService.maxLifePointsUpdate.subscribe(max => this.maxLifePoints = max);
    this.statsService.gemPouchUpdate.subscribe(gems => this.gems = gems.length);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    this.statsService.statusUpdate.subscribe(status => this.status = status);
  }
}
