import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myval;

  constructor(public navCtrl: NavController) {

  }

  onButton() {
    console.log(this.myval);
  }

  get imgUrl() {
    if (this.myval === "on") {
      return "assets/imgs/power_switch_on.png";
    }
    else
      return "assets/imgs/power_switch_off.png";
  }

  toggleSwitch(){
    if (this.myval === "on") {
      this.myval = "off";
    }
    else
      this.myval = "on";
  }

}
