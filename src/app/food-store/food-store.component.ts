import { Component, OnInit } from '@angular/core';
import { FoodService } from "../services/food.service";
import { Food } from "../models/food.model";

@Component({
  selector: 'app-food-store',
  template: `    
    <div class="window">
      <h1>Food Store</h1>
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
          <td><button (click)="buy(i)">buy</button></td>
        </tr>
        
      </table>
    </div>
  `,
  styles: [`
    
  `]
})
export class FoodStoreComponent implements OnInit {

  store:Food[];

  banned: boolean;

  constructor(private foodService:FoodService) { }

  ngOnInit() {
    this.store = this.foodService.getStore();
    this.banned = this.foodService.getBannedFromStore();
    this.foodService.updateBannedFromStore.subscribe(banned => this.banned = banned);
  }

  buy(index: number) {
    this.foodService.buy(index);
  }

}
