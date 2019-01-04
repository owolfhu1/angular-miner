import { EventEmitter, Injectable } from "@angular/core";
import { StatsService } from "./stats.service";
import { Food } from "../models/food.model";
import {Damage} from "../models/damage.model";
import {GateKeepingService} from "./gateKeeping.service";

@Injectable()
export class FoodService {
  private bannedFromStore: boolean = false;
  private fridge: Food[] = [
    // new Food('bacon', 20, 20),
    // new Food('tofu', 25, 25),
    // new Food('cabbage', 8, 10),
  ];
  private store: Food[] = [
    new Food('cabbage', 5, 3),
    new Food('bread', 9, 7),
    new Food('tuna', 12, 11),
    new Food('beef', 15, 17),
    new Food('tofu', 20, 25),
  ];
  upsetStomach: boolean = false;

  getUpsetStomach = () => this.upsetStomach;

  upsetStomachUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  getBannedFromStore() {
    return this.bannedFromStore;
  }

  getFridge(): Food[] {
    return this.fridge.slice();
  }

  getStore(): Food[] {
    return this.store.slice();
  }

  fridgeUpdate: EventEmitter<Food[]> = new EventEmitter<Food[]>();
  updateBannedFromStore: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private statsService: StatsService,
    private gateKeepingService: GateKeepingService
  ) {}

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
    this.fridgeUpdate.emit(this.fridge);
  }

  eat(index: number) {
    if(this.upsetStomach) {
      this.statsService.setStatus('You are currently too sick to eat.');
      return;
    }
    let foodItem = this.fridge.splice(index, 1)[0];
    if (foodItem.cooked) {
      this.statsService.heal(foodItem.health);
      this.statsService.setStatus(`You eat the ${foodItem.type} and it heals ${foodItem.health} life points.`);
    } else {
      this.statsService.damage(new Damage(`eating raw ${foodItem.type}`, 'come down with a severe case of diarrhea', 2));
      this.upsetStomach = true;
      this.upsetStomachUpdate.emit(this.upsetStomach);
      setTimeout(() => {
        this.upsetStomach = false;
        this.upsetStomachUpdate.emit(this.upsetStomach);
      }, 30000);
    }
    this.fridgeUpdate.emit(this.fridge);
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
      // this.statsService.setStatus(
      //   `You try to buy some ${foodItem.type} with
      //    insufficient funds, the shop owner shoos
      //    you away with a broom doing 1 damage and
      //    bans you temperately.`
      // );
      this.statsService.damage(new Damage(`attempting to steal ${foodItem.type}`, 'are attacked by the shop owner with a broom', 1));
      setTimeout(() => {
        this.bannedFromStore = false;
        this.updateBannedFromStore.emit(this.bannedFromStore);
      }, 10000);
    } else {
      this.statsService.spendCoin(foodItem.cost);
      this.statsService.setStatus(`You buy a ${foodItem.type} for ${foodItem.cost} coins.`);
      this.addFood(foodItem);

    }
  }

  addFood = (food: Food) => {
    if (this.gateKeepingService.getFridgeUnlocked())
      this.fridge.push(food);
    else
      this.statsService.setStatus(`You didn't have anywhere to store your ${food.type}, so you drop it and a fox runs off with it.`);
    this.fridgeUpdate.emit(this.fridge);
  }

  sell(index: number) {
    let itemToSell = this.fridge.splice(index, 1)[0];
    let value = itemToSell.cooked ? itemToSell.cost : Math.floor(itemToSell.cost / 2);
    this.statsService.addCoin(value);
    this.statsService.setStatus(`You sell your ${itemToSell.type} for ${value} coins.`);
    this.fridgeUpdate.emit(this.fridge);
  }

}
