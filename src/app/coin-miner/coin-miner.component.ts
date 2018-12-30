import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { Gem } from "../models/gem.model";

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
        <p>{{ coins }}</p>
      </button>
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

  private damageOutputs: {type: string, amount: number}[] = [
    {type: 'twisted leg', amount: 2},
    {type: 'broken arm', amount: 3},
    {type: 'headache', amount: 1},
    {type: 'headache', amount: 1},
    {type: 'headache', amount: 1},
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

  mine = () => {
    if(!this.activated)
      return;

    this.activated = false;
    setTimeout(() => {
      this.activated = true;
      this.clicks++;
      let result = Math.random();

      if (result < .1) {
        result = Math.random();
        if (result < .05) {
          this.statsService.addGem(new Gem('dragonscale', 20));
          this.statsService.setStatus('You found a dragonscale while mining for coins.');
          return;
        }
        result = Math.random();
        if (result < .15) {
          this.statsService.addGem(new Gem('diamond', 15));
          this.statsService.setStatus('You found a diamond while mining for coins.');
          return;
        }
        result = Math.random();
        if (result < .3) {
          this.statsService.addGem(new Gem('sapphire', 10));
          this.statsService.setStatus('You found a sapphire while mining for coins.');
          return;
        }
        this.statsService.addGem(new Gem('opal', 4));
        this.statsService.setStatus('You found a opal while mining for coins.');

        return;
      }

      result = Math.random();

      if (result < .35) {
        this.statsService.addCoin(1);
        this.statsService.setStatus('You mined a coin.');
        return;
      }

      result = Math.random();

      if (result < .2) {
        let damage = this.damageOutputs[Math.floor(Math.random() * this.damageOutputs.length)];
        this.statsService.setStatus('You got hurt mining coins, reason: ' + damage.type);
        this.statsService.changeLifePoints(damage.amount * -1);
        return;
      }

      this.statsService.setStatus('You tried to mine for coins but nothing happened');

    }, this.miningSpeed);

  }
}
