import { Component } from '@angular/core';
import { AngularMqttService, Message } from './services/angularMqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  lastMsg: Message = {
    "azim": 0,
    "azim_std": 0,
    "elev": 0,
    "elev_std": 0,
    "timestamp": 0,
    "tag-ble-id": "error"
  }

  constructor(public angularMqttService: AngularMqttService) {
    this.angularMqttService.subscribe();
  }

  ngOnInit(): void {
    this.angularMqttService.message$.subscribe((res:any)=>{ this.processMqttMessage(res) })
  }

  processMqttMessage(res:any) {
    if (res) {
      let returnMessage: Message = {
        "azim": res.azim,
        "azim_std": res.azim_std,
        "elev": res.elev,
        "elev_std": res.elev_std,
        "timestamp": res.timestamp,
        "tag-ble-id": res["tag-ble-id"],
      }
      this.lastMsg = returnMessage
    }
    else {
      console.log('message$ update without response')
    }
  }
 
}
