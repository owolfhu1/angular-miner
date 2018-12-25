import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoinMinerComponent } from './coin-miner/coin-miner.component';
import { StatsService } from "./services/stats.service";
import { StatsComponent } from './stats/stats.component';
import { GemPouchComponent } from './gem-pouch/gem-pouch.component';
import { FoodStoreComponent } from './food-store/food-store.component';
import { FoodService } from "./services/food.service";
import { FridgeComponent } from './fridge/fridge.component';

@NgModule({
  declarations: [
    AppComponent,
    CoinMinerComponent,
    StatsComponent,
    GemPouchComponent,
    FoodStoreComponent,
    FridgeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    StatsService,
    FoodService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
