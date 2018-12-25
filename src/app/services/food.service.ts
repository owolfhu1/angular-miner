import { EventEmitter, Injectable } from "@angular/core";
import { StatsService } from "./stats.service";
import { Food } from "../models/food.model";

@Injectable()
export class FoodService {

  private bannedFromStore: boolean = false;
  private fridge: Food[] = [];
  private store: Food[] = [
    new Food('bacon', 20, 20),
    new Food('tofu', 25, 25),
    new Food('cabbage', 8, 10),
    new Food('chicken', 12, 12)
  ];
  upsetStomach: boolean = false;

  getBannedFromStore() {
    return this.bannedFromStore;
  }

  getFridge(): Food[] {
    return this.fridge.slice();
  }

  getStore(): Food[] {
    return this.store.slice();
  }

  updateFridge: EventEmitter<Food[]> = new EventEmitter<Food[]>();
  updateBannedFromStore: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private statsService: StatsService) {}

  cook(index: number) {
    let foodItem = this.fridge[index];
    let fail = Math.random() > .5;
    if(foodItem.cooked || fail) {
      this.statsService.setStatus(foodItem.cooked ?
        `Your ${foodItem.type} was already cooked, now its burnt to a crisp.` :
        `Your incompetence in the kitchen resulted a burnt ${foodItem.type}. Better luck next time.`
      );
      foodItem.type = 'burnt food';
      foodItem.health = 1;
      foodItem.cost = 2;
    } else
      this.statsService.setStatus(`You cook the ${foodItem.type}. You can now safely eat it.`);
    foodItem.cooked = true;
    this.updateFridge.emit(this.fridge);
  }

  eat(index: number) {
    if(this.upsetStomach) {
      this.statsService.setStatus('You are currently too sick to eat.');
      return;
    }
    let foodItem = this.fridge.splice(index)[0];
    if (foodItem.cooked) {
      this.statsService.changeLifePoints(foodItem.health);
      this.statsService.setStatus(`You eat the ${foodItem.type} and it heals ${foodItem.health} life points.`);
    } else {
      this.statsService.changeLifePoints(-2);
      this.upsetStomach = true;
      this.statsService.setStatus(`You eat the raw ${foodItem.type} and come down with a severe case of diarrhea.`);
      setTimeout(() => {
        this.upsetStomach = false;
      }, 30000);
    }
    this.updateFridge.emit(this.fridge);
  }

  buy(index: number) {

    if(this.bannedFromStore) {
      this.statsService.setStatus('You are currently banned from the store.');
      return;
    }

    let item = this.store.slice()[index];
    let foodItem = new Food(item.type, item.cost, item.health);
    if (this.statsService.getCoins() < foodItem.cost) {
      this.bannedFromStore = true;
      this.updateBannedFromStore.emit(this.bannedFromStore);
      this.statsService.setStatus(
        `You try to buy some ${foodItem.type} with
         insufficient funds, the shop owner shoos 
         you away with a broom doing 1 damage and
         bans you temperately.`
      );
      this.statsService.changeLifePoints(-1);
      setTimeout(() => {
        this.bannedFromStore = false;
        this.updateBannedFromStore.emit(this.bannedFromStore);
      }, 10000);
    } else {
      this.fridge.push(foodItem);
      this.updateFridge.emit(this.fridge);
      this.statsService.addCoin(foodItem.cost * -1);
      this.statsService.setStatus(`You buy a ${foodItem.type} for ${foodItem.cost} coins.`);
    }
  }

  sell(index: number) {
    let itemToSell = this.fridge.splice(index, 1)[0];
    let value = itemToSell.cooked ? itemToSell.cost : Math.floor(itemToSell.cost / 2);
    this.statsService.addCoin(value);
    this.statsService.setStatus(`You sell your ${itemToSell.type} for ${value} coins.`);
    this.updateFridge.emit(this.fridge);
  }

}
