import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}


/*

  #####steps to deploy#####

  ng build --prod --output-path docs --base-href angular-miner
  copy docs/index.html into docs/404.html

  git add .
  git commit -m "deploy"
  git push origin master

  deploys to: https://owolfhu1.github.io/angular-miner/

 */
