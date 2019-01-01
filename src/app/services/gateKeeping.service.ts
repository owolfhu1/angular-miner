import {EventEmitter, Injectable} from "@angular/core";
import { StatsService } from "./stats.service";

//@Injectable()
export class GateKeepingService {

  private gemPouchUnlocked: boolean = false;
  private foodStoreUnlocked: boolean = false;
  private fridgeUnlocked: boolean = false;
  private huntingGroundUnlocked: boolean = false;

  constructor() {}

  getGemPouchUnlocked = () => this.gemPouchUnlocked;
  getFoodStoreUnlocked = () => this.foodStoreUnlocked;
  getFridgeUnlocked =() => this.fridgeUnlocked;
  getHuntingGroundUnlocked =() => this.huntingGroundUnlocked;

  gemPouchUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  foodStoreUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  fridgeUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  huntingGroundUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  unlockGemPouch = () => {
    this.gemPouchUnlocked = true;
    this.gemPouchUpdate.emit(this.gemPouchUnlocked);
  };

  unlockFoodStore = () => {
    this.foodStoreUnlocked = true;
    this.foodStoreUpdate.emit(this.foodStoreUnlocked);
  };

  unlockFridge = () => {
    this.fridgeUnlocked = true;
    this.fridgeUpdate.emit(this.fridgeUnlocked);
  };

  unlockHuntingGround = () => {
    this.huntingGroundUnlocked = true;
    this.huntingGroundUpdate.emit(this.huntingGroundUnlocked);
  };
}
