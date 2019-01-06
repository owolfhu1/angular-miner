import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoinMinerComponent } from './coin-miner/coin-miner.component';
import { StatsService } from './services/stats.service';
import { StatsComponent } from './stats/stats.component';
import { GemPouchComponent } from './gem-pouch/gem-pouch.component';
import { FoodStoreComponent } from './food-store/food-store.component';
import { FoodService } from './services/food.service';
import { FridgeComponent } from './fridge/fridge.component';
import { StatusComponent } from './status/status.component';
import { StatusMessageComponent } from './status/status-message/status-message.component';
import { GateKeepingService } from './services/gateKeeping.service';
import { HuntingGroundsComponent } from './hunting-grounds/hunting-grounds.component';
import { PlayerStoreComponent } from './player-store/player-store.component';

@NgModule({
  declarations: [
    AppComponent,
    CoinMinerComponent,
    StatsComponent,
    GemPouchComponent,
    FoodStoreComponent,
    FridgeComponent,
    StatusComponent,
    StatusMessageComponent,
    HuntingGroundsComponent,
    PlayerStoreComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    StatsService,
    FoodService,
    GateKeepingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
