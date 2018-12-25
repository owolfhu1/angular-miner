import { Component, OnInit } from '@angular/core';
import { FoodService } from "../services/food.service";
import { Food } from "../models/food.model";

@Component({
  selector: 'app-fridge',
  template: `
    <div>
      <h1>Fridge</h1>
      <p *ngIf="fridge.length === 0">You currently don't have any food, head over to the food store to buy some</p>
      <ul>
        <li *ngFor="let foodItem of fridge; let i = index">
          {{foodItem.type === 'burnt food' ? '' : foodItem.cooked ? 'Cooked' : 'Raw' }} {{ foodItem.type }}
          <button (click)="foodService.cook(i)">cook</button>
          <button (click)="foodService.eat(i)">eat</button>
          <button (click)="foodService.sell(i)">sell</button>
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
export class FridgeComponent implements OnInit {

  fridge: Food[];

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.fridge = this.foodService.getFridge();
    this.foodService.updateFridge.subscribe(fridge => this.fridge = fridge);
  }

}
