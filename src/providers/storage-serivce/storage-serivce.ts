import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export class Config {

  mqttserver: string;
  mqttport: number;
  username: string;
  password: string;
  wifipassword: string;

  constructor() {
    this.mqttserver = "";
    this.mqttport = 1883;
    this.username = "";
    this.password = "";
    this.wifipassword = "";
  }
}

export enum DevStatus {
  DEV_STATUS_UNKNOWN,
  DEV_STATUS_OFFLINE,
  DEV_STATUS_ONLINE,
  DEV_STATUS_ON,
  DEV_STATUS_OFF
}

export class DeviceInfo {
  devName: string;
  hwAddr: string;
  currentIpAddr: string;
  currentStatus: DevStatus
}
/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageServiceProvider {

  private config: Config;
  private devices: DeviceInfo[] = [];

  private datasynced: boolean;

  constructor(private storage: Storage) {
    // console.log('Hello StorageServiceProvider Provider');
    this.config = new Config();
    this.datasynced = false;
    this.getConfig();
  }

  saveConfig(mqttserver: string, mqttport: number, username: string, password: string, wifipassword: string) {
    this.config = new Config();

    this.config.mqttserver = mqttserver;
    this.config.mqttport = mqttport;
    this.config.username = username;
    this.config.password = password;
    this.config.wifipassword = wifipassword;

    this.storage.set('config', this.config);
  }

  saveConfigStruct(config: Config) {
    this.config = config;

    this.storage.set('config', this.config);
  }

  getConfig() {
    return this.storage.get('config').then((res) => {
      this.config = res == null ? new Config() : res; return this.config;
    });

  }

  addDevice(dev: DeviceInfo) {

    if (!this.datasynced) {
      this.storage.get('devices').then((res) => {
        this.devices = res == null ? [] : res;
      });

      this.datasynced = true;

      for (let element of this.devices) {
        if (element.hwAddr === dev.hwAddr) {
          return;
        }
      }

      this.devices.push(dev);
      this.storage.set('devices', this.devices);
    }
    else {
      for (let element of this.devices) {
        if (element.hwAddr === dev.hwAddr) {
          return;
        }
      }

      this.devices.push(dev);
      this.storage.set('devices', this.devices);
    }
  }

  delDevice(dev: DeviceInfo) {
    this.storage.get('devices').then((res) => {
      this.devices = res == null ? [] : res;
      let newListofDevs: DeviceInfo[] = [];
      this.devices.forEach(element => {
        if (element.hwAddr != dev.hwAddr) {
          newListofDevs.push(element);
        }
      });
      this.devices = newListofDevs;
      this.storage.set('devices', newListofDevs);
    })
  }

  getDevices() {
    return this.storage.get('devices').then((res) => {
      this.devices = res == null ? [] : res;
      this.datasynced = true;
      return this.devices.slice();
    })
  }

}
