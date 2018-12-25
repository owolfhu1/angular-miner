import { Gem } from "../models/gem.model";
import { EventEmitter } from "@angular/core";

export class StatsService {

  private lifePoints: number = 10;
  private maxLifePoints: number = 10;
  private gemPouch: Gem[] = [];
  private coins: number = 0;
  private status: string = 'try to mine some coins to start playing!';

  lifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  maxLifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  gemPouchUpdate: EventEmitter<Gem[]> = new EventEmitter<Gem[]>();
  coinsUpdate: EventEmitter<number> = new EventEmitter<number>();
  statusUpdate: EventEmitter<string> = new EventEmitter<string>();
  death: EventEmitter<void> = new EventEmitter<void>();

  getLifePoints = () => this.lifePoints;
  getMaxLifePoints = () => this.lifePoints;
  getGemPouch = () => this.gemPouch.slice();
  getCoins = () => this.coins;
  getStatus = () => this.status;

  increaseMaxLP() {
    this.maxLifePointsUpdate.emit(++this.maxLifePoints);
    this.lifePointsUpdate.emit(++this.lifePoints);
  }

  changeLifePoints = (amount: number) => {
    this.lifePoints += amount;
    if (this.lifePoints < 1) {
      this.lifePoints = 0;
      this.death.emit();
      alert('Oh dear, you have died!');
      this.setStatus('Oh dear, you have died!');
    }
    if (this.lifePoints > this.maxLifePoints)
      this.lifePoints = this.maxLifePoints;
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
    this.setStatus(`You sell a ${gem.type} for ${gem.price} coins`);
  };
  addCoin = (amount: number) => {
    this.coins += amount;
    this.coinsUpdate.emit(this.coins);
  };
  setStatus = (newStatus: string) => {
    this.status = newStatus;
    this.statusUpdate.emit(newStatus);
  }
}
