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

  onButton()
  {
    console.log(this.myval);
  }

}
