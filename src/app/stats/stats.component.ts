import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { FoodService } from "../services/food.service";
import { GateKeepingService } from "../services/gateKeeping.service";

@Component({
  selector: 'app-stats',
  template: `
    <div class="window">
      <h1>Stats</h1>
      <p>
        Life points: {{ lifePoints }}/{{ maxLifePoints }}
        <button (click)="increaseLP()">++LP({{ increaseCost }} coins)</button>
      </p>
      <p>Energy: {{ energy }}/{{ maxEnergy }}</p>
      <p>Gems in Gem Pouch: {{ gems }}</p>
      <p>Items in fridge: {{ fridge }}</p>
      <p>Coins: {{ coins }}</p>
      <h1 *ngIf="!fridgeUnlocked || !foodStoreUnlocked || !gemPouchUnlocked">Unlockables</h1>
      <ul>
        <li *ngIf="!fridgeUnlocked"><button (click)="unlockFridge()">unlock fridge ({{ fridgeUnlockCost }})</button></li>
        <li *ngIf="!foodStoreUnlocked"><button (click)="unlockFoodStore()">unlock food store ({{ foodStoreUnlockCost }})</button></li>
        <li *ngIf="!gemPouchUnlocked"><button (click)="unlockGemPouch()">unlock gem pouch ({{ gemPouchUnlockCost }})</button></li>
        <li *ngIf="!huntingGroundUnlocked"><button (click)="unlockHuntingGround()">unlock hunting grounds ({{ huntingGroundUnlockCost }})</button></li>
      </ul>
    </div>
  `,
  styles: [`
    .window {
      text-align: left;
    }
  `]
})
export class StatsComponent implements OnInit {

  energy: number;
  maxEnergy: number;
  lifePoints: number;
  maxLifePoints: number;
  gems: number;
  coins: number;
  fridge: number;
  increaseCost: number = 5;
  fridgeUnlocked: boolean;
  fridgeUnlockCost: number = 10;
  gemPouchUnlocked: boolean;
  gemPouchUnlockCost: number  = 15;
  foodStoreUnlocked: boolean;
  foodStoreUnlockCost: number = 5;
  huntingGroundUnlocked: boolean;
  huntingGroundUnlockCost: number = 30;

  constructor(
    private statsService: StatsService,
    private foodService: FoodService,
    private gateKeepingService: GateKeepingService
  ) {
  }

  ngOnInit() {
    this.energy = this.statsService.getEnergy();
    this.maxEnergy = this.statsService.getMaxEnergy();
    this.lifePoints = this.statsService.getLifePoints();
    this.maxLifePoints = this.statsService.getMaxLifePoints();
    this.gems = this.statsService.getGemPouch().length;
    this.coins = this.statsService.getCoins();
    this.fridge = this.foodService.getFridge().length;
    this.fridgeUnlocked = this.gateKeepingService.getFridgeUnlocked();
    this.gemPouchUnlocked = this.gateKeepingService.getGemPouchUnlocked();
    this.foodStoreUnlocked = this.gateKeepingService.getFoodStoreUnlocked();
    this.huntingGroundUnlocked = this.gateKeepingService.getHuntingGroundUnlocked();
    this.statsService.energyUpdate.subscribe(energy => this.energy = energy);
    this.statsService.maxEnergyUpdate.subscribe(max => this.maxEnergy = max);
    this.statsService.lifePointsUpdate.subscribe(life => this.lifePoints = life);
    this.statsService.maxLifePointsUpdate.subscribe(max => this.maxLifePoints = max);
    this.statsService.gemPouchUpdate.subscribe(gems => this.gems = gems.length);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    this.foodService.fridgeUpdate.subscribe(fridge => this.fridge = fridge.length);
    this.gateKeepingService.fridgeUpdate.subscribe(unlocked => this.fridgeUnlocked = unlocked);
    this.gateKeepingService.gemPouchUpdate.subscribe(unlocked => this.gemPouchUnlocked = unlocked);
    this.gateKeepingService.foodStoreUpdate.subscribe(unlocked => this.foodStoreUnlocked = unlocked);
    this.gateKeepingService.huntingGroundUpdate.subscribe(unlocked => this.huntingGroundUnlocked = unlocked);
  }

  increaseLP() {
    if (this.coins < this.increaseCost)
      this.statsService.setStatus(`You need ${this.increaseCost} coins to increase your max life points.`);
    else {
      this.statsService.addCoin(-1 * this.increaseCost);
      this.statsService.increaseMaxLP();
      this.statsService.setStatus('You have increased your max life points by 1');
      this.increaseCost = Math.floor(this.maxLifePoints / 2);
    }
  }

  unlockGemPouch = () => {
    if (this.gemPouchUnlockCost > this.coins)
      this.statsService.setStatus(`You need ${this.gemPouchUnlockCost} coins to unlock the gem pouch.`);
    else {
      this.statsService.setStatus(`You unlock the gem pouch for ${this.gemPouchUnlockCost} coins.`);
      this.statsService.spendCoin(this.gemPouchUnlockCost);
      this.gateKeepingService.unlockGemPouch();
    }
  };

  unlockFridge = () => {
    if (this.fridgeUnlockCost > this.coins)
      this.statsService.setStatus(`You need ${this.fridgeUnlockCost} coins to unlock the fridge.`);
    else {
      this.statsService.setStatus(`You unlock the fridge for ${this.fridgeUnlockCost} coins.`);
      this.statsService.spendCoin(this.fridgeUnlockCost);
      this.gateKeepingService.unlockFridge();
    }
  };

  unlockFoodStore = () => {
    if (this.foodStoreUnlockCost > this.coins)
      this.statsService.setStatus(`You need ${this.foodStoreUnlockCost} coins to unlock the food store.`);
    else {
      this.statsService.setStatus(`You unlock the food store for ${this.foodStoreUnlockCost} coins.`);
      this.statsService.spendCoin(this.foodStoreUnlockCost);
      this.gateKeepingService.unlockFoodStore();
    }
  };

  unlockHuntingGround = () => {
    if (this.huntingGroundUnlockCost > this.coins)
      this.statsService.setStatus(`You need ${this.huntingGroundUnlockCost} coins to unlock the hunting grounds.`);
    else {
      this.statsService.setStatus(`You unlock the hunting grounds for ${this.huntingGroundUnlockCost} coins.`);
      this.statsService.spendCoin(this.huntingGroundUnlockCost);
      this.gateKeepingService.unlockHuntingGround();
    }
  }

}
