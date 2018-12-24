import { Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { Gem } from "../models/gem.model";

@Component({
  selector: 'app-coin-miner',
  template: `
    <button 
      (click)="mine()"
      [ngClass]="{active: activated, notActive: !activated}">
      mine for coins<br/>{{ coins }}
    </button>
  `,
  styles: [`
    button {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      border: burlywood dashed 4px;
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
  }

  mine = () => {
    if(!this.activated)
      return;

    this.activated = false;
    setTimeout(() => this.activated = true, 1000);

    let result = Math.random();

    if (result < .1) {
      result = Math.random();
      if (result < .05) {
        this.statsService.addGem(new Gem('dragonscale', 100));
        this.statsService.setStatus('You found a dragonscale while mining for coins.');
        return;
      }
      result = Math.random();
      if (result < .15) {
        this.statsService.addGem(new Gem('diamond', 40));
        this.statsService.setStatus('You found a diamond while mining for coins.');
        return;
      }
      result = Math.random();
      if (result < .3) {
        this.statsService.addGem(new Gem('sapphire', 40));
        this.statsService.setStatus('You found a sapphire while mining for coins.');
        return;
      }
      this.statsService.addGem(new Gem('opal', 40));
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
      let damage = this.damageOutputs[Math.floor(Math.random()*this.damageOutputs.length)];
      this.statsService.changeLifePoints(damage.amount * -1);
      this.statsService.setStatus('You got hurt mining coins, reason: ' + damage.type);
      return;
    }

    this.statsService.setStatus('You tried to mine for coins but nothing happened');
  }
}
