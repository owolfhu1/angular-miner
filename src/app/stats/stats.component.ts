import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import {FoodService} from "../services/food.service";

@Component({
  selector: 'app-stats',
  template: `
    <div>
      <p>
        Life points: {{ lifePoints }}/{{ maxLifePoints }}
        <button (click)="increaseLP()" >++(5 coins)</button>
      </p>
      <p>Gems in Gem Pouch: {{ gems }}</p>
      <p>Items in fridge: {{ fridge }}</p>
      <p>Coins: {{ coins }}</p>
      <p>status: {{ status }}</p>
    </div>
  `,
  styles: [`
    div {
      width: 200px;
      border: blueviolet solid 3px;
    }
    p:hover {
      background: aquamarine;
    }
  `]
})
export class StatsComponent implements OnInit {

  lifePoints: number;
  maxLifePoints: number;
  gems: number;
  coins: number;
  status: string;
  fridge: number;

  constructor(
    private statsService: StatsService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.lifePoints = this.statsService.getLifePoints();
    this.maxLifePoints = this.statsService.getMaxLifePoints();
    this.gems = this.statsService.getGemPouch().length;
    this.coins = this.statsService.getCoins();
    this.status = this.statsService.getStatus();
    this.fridge = this.foodService.getFridge().length;
    this.statsService.lifePointsUpdate.subscribe(life => this.lifePoints = life);
    this.statsService.maxLifePointsUpdate.subscribe(max => this.maxLifePoints = max);
    this.statsService.gemPouchUpdate.subscribe(gems => this.gems = gems.length);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    this.statsService.statusUpdate.subscribe(status => this.status = status);
    this.foodService.updateFridge.subscribe(fridge => this.fridge = fridge.length);
  }

  increaseLP() {
    if (this.coins < 5)
      this.statsService.setStatus('You need 5 coins to increase your max life points.');
    else {
      this.statsService.addCoin(-5);
      this.statsService.increaseMaxLP();
      this.statsService.setStatus('You have increased your max life points by 1');
    }
  }

}
