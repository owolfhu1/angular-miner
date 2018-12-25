import { Component, OnInit } from '@angular/core';
import { FoodService } from "../services/food.service";
import { Food } from "../models/food.model";

@Component({
  selector: 'app-food-store',
  template: `    
    <div>
      <h1>Food Store</h1>
      <p *ngIf="banned">You are currently banned from the store.</p>
      <ul>
        <li *ngFor="let foodItem of store; let i = index">
          {{ foodItem.type }}({{ foodItem.health }}): {{ foodItem.cost }}: coins
          <p><button (click)="buy(i)">buy</button></p>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    div {
      width: 200px;
      border: blueviolet solid 3px;
    }
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
