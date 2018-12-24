import { Gem } from "../models/gem.model";
import { EventEmitter } from "@angular/core";

export class StatsService {

  private lifePoints: number = 20;
  private maxLifePoints: number = 20;
  private gemPouch: Gem[] = [];
  private coins: number = 0;
  private status: string = 'try to mine some coins to start playing!';

  lifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  maxLifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  gemPouchUpdate: EventEmitter<Gem[]> = new EventEmitter<Gem[]>();
  coinsUpdate: EventEmitter<number> = new EventEmitter<number>();
  statusUpdate: EventEmitter<string> = new EventEmitter<string>();

  getLifePoints = () => this.lifePoints;
  getMaxLifePoints = () => this.lifePoints;
  getGemPouch = () => this.gemPouch.slice();
  getCoins = () => this.coins;
  getStatus = () => this.status;

  changeLifePoints = (amount: number) => {
    this.lifePoints += amount;
    this.lifePointsUpdate.emit(this.lifePoints);
  };
  addGem = (gem: Gem) => {
    this.gemPouch.push(gem);
    this.gemPouchUpdate.emit(this.gemPouch);
  };
  sellGem = (index: number) => {
    let gem = this.gemPouch.splice(index, 1)[0];
    this.addCoin(gem.price);
    this.gemPouchUpdate.emit(this.gemPouch);
  };
  addCoin = (amount: number) => {
    this.coins += amount;
    this.coinsUpdate.emit(amount);
  };
  setStatus = (newStatus: string) => {
    this.status = newStatus;
    this.statusUpdate.emit(newStatus);
  }
}
