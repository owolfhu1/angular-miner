import { Component, OnInit } from '@angular/core';
import { FoodService } from "../services/food.service";
import { Food } from "../models/food.model";
import {StatsService} from "../services/stats.service";

@Component({
  selector: 'app-general-store',
  template: `    
    <div class="window">
      <h1>General Store</h1>
      <p *ngIf="banned">You are currently banned from the store.</p>
      <table>
        
        <tr>
          <th>type</th>
          <th>cost</th>
          <th>health</th>
          <th>buy</th>
        </tr>
        
        <tr *ngFor="let foodItem of store; let i = index">
          <td>{{ foodItem.type }}</td>
          <td>{{ foodItem.cost }}</td>
          <td>{{ foodItem.health }}</td>
          <td><button (click)="buy(i)">{{ foodItem.cost > coins ? 'steal' : 'buy' }}</button></td>
        </tr>
        
      </table>
    </div>
  `,
  styles: [`
    table{
      margin-left: auto;
      margin-right: auto;
    }
    td{
      padding: 5px;
    }
  `]
})
export class FoodStoreComponent implements OnInit {

  store: Food[];

  coins: number;

  banned: boolean;

  constructor(private foodService:FoodService, private statsService: StatsService) { }

  ngOnInit() {
    this.coins = this.statsService.getCoins();
    this.store = this.foodService.getStore();
    this.banned = this.foodService.getBannedFromStore();
    this.foodService.updateBannedFromStore.subscribe(banned => this.banned = banned);
    this.statsService.coinsUpdate.subscribe(coins => this.coins = coins);
  }

  buy(index: number) {
    this.foodService.buy(index);
  }

}
