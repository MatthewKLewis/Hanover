import { Component } from '@angular/core';
import { AngularMqttService, Message, Position } from './services/angularMqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  lastMsg: Position = {
    "tag-ble-id" : "error",
    "x" : 0,
    "y" : 0,
    "lastX": -1,
    "lastY": -1,
  }

  constructor(public angularMqttService: AngularMqttService) {
    //this.angularMqttService.subscribe('aoa-test');
    this.angularMqttService.subscribe('/merakimv/Q2EV-4RBE-ANPV/custom_analytics'); ///merakimv/Q2EV-4RBE-ANPV/custom_analytics
  }

  ngOnInit(): void {
    this.angularMqttService.message$.subscribe((res:any)=>{ this.processMqttMessage(res) })
  }

  processMqttMessage(res:any) {
    console.log(res);
    if (res) {
      let returnMessage: Message = {
        "azim": res.azim,
        "azim_std": res.azim_std,
        "elev": res.elev,
        "elev_std": res.elev_std,
        "timestamp": res.timestamp,
        "tag-ble-id": res["tag-ble-id"],
      }
      let tagPosition: Position = {
        "tag-ble-id" : returnMessage['tag-ble-id'],
        "x" : -(Math.sin(this.degreesToRadians(returnMessage.azim))),
        "y" : 0,
        "lastX": 0,
        "lastY": 0,
      }
      this.lastMsg = tagPosition
    }
    else {
      console.log('message$ update without response')
    }
  }

  degreesToRadians(degrees:number) {
    var pi = Math.PI;
    return degrees * (pi/180);
  }
 
}
