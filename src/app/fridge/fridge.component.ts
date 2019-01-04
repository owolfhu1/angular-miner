import { Component, OnInit } from '@angular/core';
import { FoodService } from "../services/food.service";
import { Food } from "../models/food.model";

@Component({
  selector: 'app-fridge',
  template: `
    <div class="window">
      <h1>Fridge</h1>
      <p *ngIf="sick">You are currently too sick to eat.</p>
      <p *ngIf="fridge.length === 0">You currently don't have any food, head over to the food store to buy some</p>
      <table>
        <tr *ngFor="let foodItem of fridge; let i = index">
          <td>{{foodItem.type === 'burnt food' ? '' : foodItem.cooked ? 'Cooked' : 'Raw' }} {{ foodItem.type }}</td>
          <td><button (click)="foodService.cook(i)">cook</button></td>
          <td><button (click)="foodService.eat(i)">eat({{ foodItem.health }})</button></td>
          <td><button (click)="foodService.sell(i)">sell</button></td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
   
  `]
})
export class FridgeComponent implements OnInit {

  fridge: Food[];
  sick: boolean;

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.fridge = this.foodService.getFridge();
    this.sick = this.foodService.getUpsetStomach();
    this.foodService.fridgeUpdate.subscribe(fridge => this.fridge = fridge);
    this.foodService.upsetStomachUpdate.subscribe(sick => this.sick = sick);
  }

}
