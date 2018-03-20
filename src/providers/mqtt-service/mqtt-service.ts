import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { StorageServiceProvider, Config } from '../storage-serivce/storage-serivce';

declare var cordova;

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

/*
  Generated class for the MqttServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MqttServiceProvider {

  mqttserver;
  mqttport;
  username;
  password;

  config: Config;

  static connected;

  static listnerCallback: (payload, params) => void;

  constructor(private storageProvider: StorageServiceProvider,
    public plt: Platform) {

    this.plt.resume.subscribe((event) => this.onResume());
    this.plt.pause.subscribe((event) => this.onPause());

    this.getConfig();

  }

  getConfig() {
    this.storageProvider.getConfig().then((config) => {
      this.config = config;

      this.username = "jame";
      this.password = "lemon";
      this.mqttport = "1883";
      this.mqttserver = "192.168.43.83";

      console.log(this.mqttserver);
      console.log(this.username);
      console.log(this.password);
    });
  }


  onResume() {
    console.log("MqttServiceProvider: onResume() called.");
    this.connectServer();
  }

  onPause() {
    console.log("MqttServiceProvider: onPause() called.");
    this.disconnectServer();
  }

  disconnectServer() {
    if (MqttServiceProvider.connected == true) {
      console.log("disconnecting server.");
      cordova.plugins.CordovaMqTTPlugin.disconnect({
        success: function (s) {
          console.log("disconnect success");
        },
        error: function (e) {
          console.log("disconnect error");
        }
      });

      MqttServiceProvider.connected = false;
    }
    else {
      console.log("not connected so just done.");
    }
  }

  generateClientId(): string {
    return Guid.newGuid();
  }

  connectServer() {
    let client_id: string = this.generateClientId();
    console.log("connecting as:" + client_id);

    console.log(this.mqttserver);

    cordova.plugins.CordovaMqTTPlugin.connect({
      url: "tcp://" + this.mqttserver,
      port: this.mqttport,
      clientId: client_id, //todo: generate this
      connectionTimeout: 3000,
      username: this.username,
      password: this.password,
      keepAlive: 60,
      success: this.onConnectSuccess,
      error: function (e) {
        console.log("connect error");
      },
      onConnectionLost: function () {
        console.log("disconnect");
      }
    });
  }

  onConnectSuccess(s) {
    console.log("connect success");

    MqttServiceProvider.connected = true;

    cordova.plugins.CordovaMqTTPlugin.subscribe({
      topic: "/" + this.username + "/#",
      qos: 0,
      success: function (s) {
        console.log("subscribe success!");
      },
      error: function (e) {
        console.log("subscribe failed!");
      }
    });

    if (MqttServiceProvider.listnerCallback) {
      cordova.plugins.CordovaMqTTPlugin.listen("/" + this.username + "/+devMac/+branch", function (payload, params) {
        MqttServiceProvider.listnerCallback(payload, params);
      });
    }
  }

  registerListener(callback: (payload, params) => void) {
    // "/topic/+singlewc/#multiwc"  ===>

    //Callback:- (If the user has published to /topic/room/hall)
    //payload : contains payload data
    //params : {singlewc:room,multiwc:hall}
    MqttServiceProvider.listnerCallback = callback;

    // cordova.plugins.CordovaMqTTPlugin.listen("/" + this.username + "/+devMac/+branch", function (payload, params) {
    //   // console.log(JSON.stringify(params) + ": " + payload)
    //   //{"devMac":"30AEA435FDDC","branch":"status"}: {"name": "status", "data": [{"sensor": "sensor0", "value": 1}]}
    //   // console.log(params.devMac); //"30AEA435FDDC"
    //   // console.log(params.branch); //"status"
    //   MqttServiceProvider.listnerCallback(payload, params);
    // });

  }

  sendMsg(topic, message) {

    if (!MqttServiceProvider.connected) {
      console.log("not connected!");
      return;
    }

    console.log("send msg!");
    cordova.plugins.CordovaMqTTPlugin.publish({
      topic: topic,
      payload: message,
      qos: 0,
      retain: false,
      success: function (s) {
        console.log("send success!");
      },
      error: function (e) {
        console.log("send error!");
      }
    });
  }
}
