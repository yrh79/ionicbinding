import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttServiceProvider } from '../../providers/mqtt-service/mqtt-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myval;
  _ngZone: NgZone;

  constructor(public navCtrl: NavController,
    private mqttService: MqttServiceProvider,
    zone: NgZone) {
    this.mqttService.getConfig();
    this.mqttService.registerListener((payload, params) => {
      console.log("onMqttData():" + JSON.stringify(params) + ": " + payload);
      this._ngZone = zone;
      zone.run(() => {
        this.toggleSwitch();
      });
    });
    this.mqttService.connectServer();

    // this.onMqttData = this.onMqttData.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
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

  toggleSwitch() {
    console.log(this.myval);

    if (this.myval === "on") {
      this.myval = "off";
    }
    else
      this.myval = "on";
  }

  // onMqttData(payload, params) {
  //   console.log("onMqttData():" + JSON.stringify(params) + ": " + payload);
  //   this.toggleSwitch();
  // }

}
