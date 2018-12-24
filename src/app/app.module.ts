import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoinMinerComponent } from './coin-miner/coin-miner.component';
import { StatsService } from "./services/stats.service";
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    CoinMinerComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StatsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
