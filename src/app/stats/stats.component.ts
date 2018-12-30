import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import {FoodService} from "../services/food.service";

@Component({
  selector: 'app-stats',
  template: `
    <div class="window">
      <h1 style="text-align: center">Stats</h1>
      <p>
        Life points: {{ lifePoints }}/{{ maxLifePoints }}
        <button (click)="increaseLP()">++LP({{ increaseCost }} coins)</button>
      </p>
      <p>Gems in Gem Pouch: {{ gems }}</p>
      <p>Items in fridge: {{ fridge }}</p>
      <p>Coins: {{ coins }}</p>
      <!--<p>status: {{ status }}</p>-->
    </div>
  `,
  styles: [`
    .window {
      text-align: left;
    }
  `]
})
export class StatsComponent implements OnInit {

  lifePoints: number;
  maxLifePoints: number;
  gems: number;
  coins: number;
  // status: string;
  fridge: number;
  increaseCost: number = 5;

  constructor(
    private statsService: StatsService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.lifePoints = this.statsService.getLifePoints();
    this.maxLifePoints = this.statsService.getMaxLifePoints();
    this.gems = this.statsService.getGemPouch().length;
    this.coins = this.statsService.getCoins();
    // this.status = this.statsService.getStatus();
    this.fridge = this.foodService.getFridge().length;
    this.statsService.lifePointsUpdate.subscribe(life => this.lifePoints = life);
    this.statsService.maxLifePointsUpdate.subscribe(max => this.maxLifePoints = max);
    this.statsService.gemPouchUpdate.subscribe(gems => this.gems = gems.length);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    // this.statsService.statusUpdate.subscribe(status => this.status = status);
    this.foodService.updateFridge.subscribe(fridge => this.fridge = fridge.length);
  }

  increaseLP() {
    if (this.coins < this.increaseCost)
      this.statsService.setStatus(`You need ${this.increaseCost} coins to increase your max life points.`);
    else {
      this.statsService.addCoin(-1 * this.increaseCost);
      this.statsService.increaseMaxLP();
      this.statsService.setStatus('You have increased your max life points by 1');
      this.increaseCost = Math.floor(this.maxLifePoints/2);
    }
  }

}
