import { Component, OnInit } from '@angular/core';

import {StatsService} from '../services/stats.service';
import {Damage} from '../models/damage.model';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {FoodService} from '../services/food.service';
import {Food} from '../models/food.model';

@Component({
  selector: 'app-hunting-grounds',
  template: `
    <div class="window">
    
      <h1>Hunting Grounds</h1>
      
      <button (click)="hunt()"><h3>Go Hunting</h3></button> You have {{ energy }} energy

      <h1>Your weapons</h1>
      
      <div class="weapon" *ngFor="let weapon of weapons; let i = index">
        <b>&nbsp;&nbsp;&nbsp;&nbsp;{{ weapon.name }}</b>
        <button *ngIf="i != selected" (click)="selected = i">select</button>
        <span *ngIf="i === selected">(selected)</span><br/>
        energy used: {{ weapon.energy }} &nbsp;&nbsp;&nbsp; weapon power: {{ weapon.power }}<br/>
        recoil damage: {{ weapon.recoil }} &nbsp;&nbsp;&nbsp;
        <button *ngIf="weapon.name !== 'fist'" (click)="sell(i)">sell({{ resale(weapon.cost) }})</button>
      </div>
      

      <h1>weapon store</h1>

      <table>

        <tr>
          <th>name</th>
          <th>energy</th>
          <th>power</th>
          <th>recoil</th>
          <th>buy</th>
        </tr>

        <tr *ngFor="let weapon of weaponStore; let i = index">
          <td>{{ weapon.name }}</td>
          <td>{{ weapon.energy }}</td>
          <td>{{ weapon.power }}</td>
          <td>{{ weapon.recoil }}</td>
          <td><button (click)="buy(i)">buy ({{ weapon.cost }})</button></td>
        </tr>

      </table>

    </div>
  `,
  styles: [`
    .window {
      text-align: left;
      font-size: small;
    }
    .weapon {
      border: blueviolet dashed 1px;
      border-radius: 10px;
      padding: 5px;
      margin: 5px;
    }
  `]
})


export class HuntingGroundsComponent implements OnInit {

  private animals = [
    new Food('bear', 40, 30),
    new Food('crow', 10, 5),
    new Food('rabbit', 18, 8),
    new Food('deer', 32, 23),
    new Food('fox', 23, 15),
    new Food('rat', 8, 3),
    new Food('snake', 14, 6)
  ];

  energy: number;
  coins: number;

  resale = number => Math.floor(number / 2);

  selected = 0;

  weaponStore: { name: string, energy: number, cost: number, power: number, recoil: number }[] = [
    {name: 'knife', energy: 7, cost: 10, power: 20, recoil: 2},
    {name: 'spear', energy: 6, cost: 20, power: 25, recoil: 3},
    {name: 'boomerang', energy: 3, cost: 30, power: 35, recoil: 4},
    {name: 'bow and arrow', energy: 4, cost: 40, power: 40, recoil: 5},
    {name: 'shot gun', energy: 2, cost: 75, power: 60, recoil: 9},
    {name: 'sniper rifle', energy: 6, cost: 100, power: 80, recoil: 7}
  ];

  weapons: { name: string, energy: number, cost: number, power: number, recoil: number }[] = [
    {name: 'fist', energy: 7, cost: 0, power: 10, recoil: 1}
  ];

  constructor(
    private statsService: StatsService,
    private foodService: FoodService
  ) {
  }

  ngOnInit() {
    this.energy = this.statsService.getEnergy();
    this.coins = this.statsService.getCoins();
    this.statsService.energyUpdate.subscribe(energy => this.energy = energy);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
  }

  buy = index => {
    if (this.weaponStore[index].cost > this.coins)
      this.statsService.setStatus(`you need ${this.weaponStore[index].cost
        } coins to buy the ${this.weaponStore[index].name}`);
    else {
      this.statsService.setStatus(`You buy the ${this.weaponStore[index].name}`);
      this.statsService.spendCoin(this.weaponStore[index].cost);
      this.weapons.push(this.weaponStore.splice(index, 1)[0]);
    }
  }

  sell = index => {
    if (index === this.selected)
      this.statsService.setStatus('You should probably un-select that before you try to sell it!');
    else {
      if (index < this.selected)
        this.selected--;
      this.statsService.setStatus(`You sell the ${this.weapons[index].name} for ${this.resale(this.weapons[index].cost)} coins`);
      this.statsService.addCoin(this.resale(this.weapons[index].cost));
      this.weaponStore.push(this.weapons.splice(index, 1)[0]);
    }
  }

  hunt = () => {
    const weapon = this.weapons[this.selected];
    if (weapon.energy > this.energy)
      this.statsService.setStatus('You do not have enough energy to go hu' +
        'nting, you will need rest a little (wait) or select a more efficient weapon.');
    else {
      this.statsService.userEnergy(weapon.energy);
      if (Math.random() < .01 * weapon.power) {
        // sucessful hunt
        let animal = JSON.parse(JSON.stringify(this.animals))[Math.floor(Math.random() * this.animals.length)];
       // let animal: Food = this.animals.slice()[Math.floor(Math.random() * this.animals.length)];
        this.statsService.setStatus(`You successfuly hunt a ${animal.type}!!`);
        this.foodService.addFood(animal);
        return;
      }
      if (Math.random() < .3) {
        this.statsService.damage(new Damage(`hunting with your ${weapon.name}`, `hurt yourself`, weapon.recoil));
      } else
        this.statsService.setStatus('You go hunting but despite your best efforts you fail to catch anything.');
    }
  }
}
