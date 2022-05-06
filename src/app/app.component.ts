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
      let tagPosition: Position = {
        "tag-ble-id" : returnMessage['tag-ble-id'],
        "x" : (Math.sin(this.degreesToRadians(returnMessage.azim))),
        "y" : 0,
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
