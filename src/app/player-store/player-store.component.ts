import { Component, OnInit } from '@angular/core';
import {Gem} from '../models/gem.model';
import {StatsService} from '../services/stats.service';

@Component({
  selector: 'app-player-store',
  template: `
    <div class="window">
      <h1>Player Store</h1>
      {{ register }}/{{ registerLimit }} coins in the register. <button *ngIf="register > 0" (click)="collect()">collect</button>
      <button (click)="increaseRegister()">increase register size({{ registerLimitUpgradeCost() }})</button>
      <br/><br/>
      <button *ngIf="!gemStockUnlocked" (click)="unlockGemStock()">Unlock gem stock({{ gemStockUnlockPrice }})</button>

      <div style="border: black solid 1px;border-radius: 5px" *ngIf="gemStockUnlocked">
        There are currently {{ gemStock.length }} gems in stock.
        <div style="font-size: 11px">Your store can sell a gem every {{ gemStockTick/1000 }} 
        seconds granted there is space in the register and you have one in stock.</div>
      </div>

    </div>
  `,
  styles: [`
  
  `]
})
export class PlayerStoreComponent implements OnInit {

  coins: number;

  register: number = 0;
  registerLimit: number = 20;
  registerLimitIncrease: number = 10;
  registerLimitUpgradeCost = () => Math.floor(this.registerLimit / 2);

  increaseRegister = () => {
    if (this.coins < this.registerLimitUpgradeCost())
      this.statsService.setStatus(`You need ${this.registerLimitUpgradeCost()} coins to increase the register capacity.`);
    else {
      this.statsService.spendCoin(this.registerLimitUpgradeCost());
      this.statsService.setStatus(`You increase the register capacity by ${
        this.registerLimitIncrease} for ${this.registerLimitUpgradeCost()} coins.`);
      this.registerLimit += this.registerLimitIncrease;
      this.promptedFullRegister = false;
    }
  }

  gemStock: Gem[] = [];
  gemStockInterval;
  gemStockTick: number = 30000;
  gemStockUnlocked: boolean = false;
  gemStockUnlockPrice: number = 20;


  unlockGemStock = () => {
    if (this.coins < this.gemStockUnlockPrice)
      this.statsService.setStatus(`You need ${this.gemStockUnlockPrice} coins to unlock the gem stock`);
    else {
      this.statsService.setStatus(`You unlock the gem stock for ${
        this.gemStockUnlockPrice} coins. You can now add gems from your gem bag.`);
      this.statsService.spendCoin(this.gemStockUnlockPrice);
      this.statsService.unlockGemStock();
      this.gemStockUnlocked = true;
    }
  }


  specialtyStock: number = 0;
  specialtyStockTick: number = 1000;
  specialtyStockUnlocked: boolean = false;
  specialtyStockUnlockPrice: number = 15;
  specialtyStockName: string = '';
  specialtyStockBuyCost: number = 5;
  specialtyStockSellCost: number = 8;

  constructor(private statsService: StatsService) { }

  promptedFullRegister = false;

  ngOnInit() {
    this.coins = this.statsService.getCoins();
    this.gemStockUnlocked = this.statsService.getGemStockUnlocked();
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    this.statsService.emitGemToStock.subscribe(gem => {
      this.gemStock.push(gem);
    });

    this.gemStockInterval = setInterval(() => {
      if (this.gemStock.length > 0) {
        if (this.register + this.getGemPrice(this.gemStock[0].price) <= this.registerLimit) {
          const gem = this.gemStock.splice(0, 1)[0];
          this.statsService.setStatus(`Your store sells a ${gem.type} for ${this.getGemPrice(gem.price)}.`);
          this.register += this.getGemPrice(gem.price);
        } else if (!this.promptedFullRegister) {
          this.promptedFullRegister = true;
          this.statsService.setStatus(`Your store is trying to sell a ${this.gemStock[0].type
            }, but there is not enough space in the register. collect your earnings to continue selling`);
        }
      }
    }, this.gemStockTick);

  }

  getGemPrice = orgPrice => Math.floor(orgPrice * 1.5);

  collect = () => {
    this.statsService.setStatus(`You collect ${this.register} coins from the register.`);
    this.statsService.addCoin(this.register);
    this.register = 0;
    this.promptedFullRegister = false;
  }

}
