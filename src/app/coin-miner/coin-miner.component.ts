import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { Gem } from "../models/gem.model";
import {Damage} from "../models/damage.model";

@Component({
  selector: 'app-coin-miner',
  template: `
    <div class="window">
      <br/>
      <button 
        (click)="mine()"
        [ngClass]="{
            active: activated, 
            notActive: !activated,
            theButton: true
        }">
        <h3 *ngIf="activated">mine for coins</h3>
        <h3 *ngIf="!activated">{{ deactivatedMessage }}</h3>
        <p>You have {{ coins }} coins</p>
      </button>
      <p>
        <button *ngIf="!autoMinerUnlocked" (click)="unlockAutoMiner()">
          unlock auto miner({{ autoMinerCost }})
        </button>
        <button *ngIf="autoMinerUnlocked" (click)="autoMine()">
          {{ autoMiner ? 'Stop Mining' : 'Start Mining'}}
        </button>
      </p>
      <p>
        <button *ngIf="miningSpeed > 300" (click)="increaseSpeed()">increase mining speed: {{ increaseCost }} coins</button>
      </p>
      <p>mining attempts: {{ clicks }}</p>
    </div>
  `,
  styles: [`
    .theButton {
      width: 150px;
      height: 150px;
      border-radius: 75px;
      border: burlywood dashed 4px;
      margin: auto;
    }
    .active {
      background: yellow;
    }
    .notActive {
      background: gray;
    }
  `]
})
export class CoinMinerComponent implements OnInit {

  coins: number;
  activated: boolean = true;
  deactivatedMessage: string = 'mining...';
  clicks: number = 0;
  miningSpeed = 1500;
  increaseCost = 10;
  autoMinerUnlocked: boolean = false;
  autoMiner: boolean = false;
  autoMinerCost: number = 50;

  private damageOutputs: Damage[] = [
    new Damage('coin mining', 'twist your leg', 3),
    new Damage('coin mining', 'stub your toe', 2),
    new Damage('coin mining', 'stub your toe', 2),
    new Damage('coin mining', 'get a headache', 1),
    new Damage('coin mining', 'get a headache', 1),
    new Damage('coin mining', 'get a headache', 1),
    new Damage('coin mining', 'get a headache', 1)
  ];

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.coins = this.statsService.getCoins();
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
    this.statsService.death.subscribe(() => {
      this.activated = false;
      this.deactivatedMessage = 'Dead men can\'t mine.';
    });
  }

  increaseSpeed = () => {
    if (this.statsService.getCoins() < this.increaseCost) {
      this.statsService.setStatus(`You need ${this.increaseCost} coins to increase your mining speed.`);
    } else {
      this.statsService.addCoin(-1 * this.increaseCost);
      this.miningSpeed -= 200;
      this.statsService.setStatus(`You have increased your mining speed, you can now mine in just ${this.miningSpeed} ms.`);
      this.increaseCost += 10;
    }
  };

  autoMine = () => {
    this.autoMiner = ! this.autoMiner;
    if (this.autoMiner && this.activated)
      this.mine();
  }

  unlockAutoMiner = () => {
    if (this.coins < this.autoMinerCost)
      this.statsService.setStatus(`You need ${this.autoMinerCost} coins to unlock the AutoMiner500™.`);
    else {
      this.autoMinerUnlocked = true;
      this.statsService.spendCoin(this.autoMinerCost);
      this.statsService.setStatus(`You have unlocked the AutoMiner500™ for ${this.autoMinerCost} coins!`);
    }
  }

  mine = () => {
    if(!this.activated)
      return;

    this.activated = false;
    setTimeout(() => {
      this.activated = true;

      if (this.autoMiner)
        setTimeout(() => this.mine(), 100);

      this.clicks++;
      let result = Math.random();

      if (result < .1) {
        result = Math.random();
        if (result < .05) {
          this.statsService.setStatus(`You found a dragonscale while mining for coins.`);
          this.statsService.addGem(new Gem('dragonscale', 20, false));
          return;
        }
        result = Math.random();
        if (result < .15) {
          this.statsService.setStatus(`You found a diamond while mining for coins.`);
          this.statsService.addGem(new Gem('diamond', 15, false));
          return;
        }
        result = Math.random();
        if (result < .3) {
          this.statsService.setStatus(`You found a sapphire while mining for coins.`);
          this.statsService.addGem(new Gem('sapphire', 10, false));
          return;
        }
        this.statsService.setStatus(`You found a opal while mining for coins.`);
        this.statsService.addGem(new Gem('opal', 4, false));
        return;
      }

      result = Math.random();

      if (result < .35) {
        const amount = Math.floor((Math.random() * 5) + 1);
        this.statsService.addCoin(amount);
        this.statsService.setStatus(`You mined ${amount === 1 ? 'a' : amount} coin${amount === 1 ? '' : 's'}.`);
        return;
      }

      result = Math.random();

      if (result < .2) {
        let damage = this.damageOutputs[Math.floor(Math.random() * this.damageOutputs.length)];
        this.statsService.damage(damage);
        return;
      }

      this.statsService.setStatus('You tried to mine for coins but nothing happened');





    }, this.miningSpeed);
  }
}

