import { Gem } from '../models/gem.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Damage} from '../models/damage.model';
import {GateKeepingService} from './gateKeeping.service';

@Injectable()
export class StatsService {

  energyRestoreInterval;
  constructor(private gateKeepingService: GateKeepingService) {
    this.energyRestoreInterval = setInterval(() => {
      if (this.energy < this.maxEnergy) {
        this.energy++;
        this.energyUpdate.emit(this.energy);
      }
    }, 10000);
  }


  private energy = 10;
  private maxEnergy = 10;
  private lifePoints = 10;
  private maxLifePoints = 10;
  private gemPouch: Gem[] = [];
  private gemPouchSize = 3;
  private coins = 1000;
  private status = 'try to mine some coins to start playing!';

  gemStockUnlocked: boolean = false;
  getGemStockUnlocked = () => this.gemStockUnlocked;
  gemStockUnlockedUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  unlockGemStock = () => {
    this.gemStockUnlocked = true;
    this.gemStockUnlockedUpdate.emit(this.gemStockUnlocked);
  }
  emitGemToStock: EventEmitter<Gem> = new EventEmitter<Gem>();
  shipToStore = index => {
    let gem = this.gemPouch.splice(index, 1)[0];
    this.gemPouchUpdate.emit(this.gemPouch);
    this.setStatus(`You ship the ${gem.type} to your player store.`);
    this.emitGemToStock.emit(gem);
  }

  energyUpdate: EventEmitter<number> = new EventEmitter<number>();
  maxEnergyUpdate: EventEmitter<number> = new EventEmitter<number>();
  lifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  maxLifePointsUpdate: EventEmitter<number> = new EventEmitter<number>();
  gemPouchUpdate: EventEmitter<Gem[]> = new EventEmitter<Gem[]>();
  coinsUpdate: EventEmitter<number> = new EventEmitter<number>();
  statusUpdate: EventEmitter<string> = new EventEmitter<string>();
  death: EventEmitter<void> = new EventEmitter<void>();


  getEnergy = () => this.energy;
  getMaxEnergy = () => this.maxEnergy;
  getLifePoints = () => this.lifePoints;
  getMaxLifePoints = () => this.lifePoints;
  getGemPouch = () => this.gemPouch.slice();
  getGemPouchSize = () => this.gemPouchSize;
  getCoins = () => this.coins;
  getStatus = () => this.status;


  increaseMaxLP() {
    this.maxLifePointsUpdate.emit(++this.maxLifePoints);
    this.lifePointsUpdate.emit(++this.lifePoints);
  }

  private changeLifePoints = (amount: number) => {
    this.lifePoints += amount;
    if (this.lifePoints < 1) {
      this.lifePoints = 0;
      this.death.emit();
      alert('Oh dear, you have died!');
      this.setStatus('Oh dear, you have died!');
      clearInterval(this.energyRestoreInterval);
    }
    if (this.lifePoints > this.maxLifePoints) {
      this.lifePoints = this.maxLifePoints;
    }
    this.lifePointsUpdate.emit(this.lifePoints);
  }
  addGem = (gem: Gem) => {
    if (!this.gateKeepingService.getGemPouchUnlocked()) {
      this.setStatus(`You don't have anywhere to put the ${gem.type}, so you are forced to toss it.`);
    }
    else if (this.gemPouch.length >= this.gemPouchSize) {
      this.setStatus(`Gem pouch is full! You throw ${gem.type} the away`);
         }
    else {
      this.setStatus(`You put the ${gem.type} in your gem pouch`);
      this.gemPouch.push(gem);
      this.gemPouchUpdate.emit(this.gemPouch);
    }
  }
  sellGem = (index: number) => {
    const gem = this.gemPouch.splice(index, 1)[0];
    this.addCoin(gem.price);
    this.gemPouchUpdate.emit(this.gemPouch);
    this.setStatus(`You sell a ${gem.type} for ${gem.price} coins`);
  }
  addCoin = (amount: number) => {
    this.coins += amount;
    this.coinsUpdate.emit(this.coins);
  }
  spendCoin = (amount: number) => {
    this.coins -= amount;
    this.coinsUpdate.emit(this.coins);
  }
  setStatus = (newStatus: string) => {
    this.status = newStatus;
    this.statusUpdate.emit(newStatus);
  }
  damage = (damage: Damage) => {
    this.setStatus(`While ${damage.type} ${damage.reason} and you take ${damage.amount} damage.`);
    this.changeLifePoints(-1 * damage.amount);
  }
  heal = (amount: number) => this.changeLifePoints(amount);
  userEnergy = (amount: number) => {
    this.energy -= amount;
    this.energyUpdate.emit(this.energy);
  }

}
