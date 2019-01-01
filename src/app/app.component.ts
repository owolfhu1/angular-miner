import { Component } from '@angular/core';
import {GateKeepingService} from "./services/gateKeeping.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  gemPouchUnlocked: boolean;
  fridgeUnlocked: boolean;
  foodStoreUnlocked: boolean;
  huntingGroundsUnlocked: boolean;

  constructor(private gateKeepingService: GateKeepingService) {}

  ngOnInit() {
    this.gemPouchUnlocked = this.gateKeepingService.getGemPouchUnlocked();
    this.fridgeUnlocked = this.gateKeepingService.getFridgeUnlocked();
    this.foodStoreUnlocked = this.gateKeepingService.getFoodStoreUnlocked();
    this.huntingGroundsUnlocked = this.gateKeepingService.getHuntingGroundUnlocked();
    this.gateKeepingService.gemPouchUpdate.subscribe(unlocked => this.gemPouchUnlocked = unlocked);
    this.gateKeepingService.fridgeUpdate.subscribe(unlocked => this.fridgeUnlocked = unlocked);
    this.gateKeepingService.foodStoreUpdate.subscribe(unlocked => this.foodStoreUnlocked = unlocked);
    this.gateKeepingService.huntingGroundUpdate.subscribe(unlocked => this.huntingGroundsUnlocked = unlocked);
  }

}

/*

  #####steps to deploy#####

  ng build --prod --output-path docs --base-href angular-miner

  copy docs/index.html into new file: docs/404.html

  git add, commit, push

  deploys to: https://owolfhu1.github.io/angular-miner/

 */
