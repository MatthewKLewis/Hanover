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
  alert: boolean = false;

  constructor(public angularMqttService: AngularMqttService) {
    this.angularMqttService.subscribe('aoa-test');
    this.angularMqttService.subscribe('/merakimv/Q2JV-XAYQ-NSGH/custom_analytics'); ///merakimv/Q2EV-4RBE-ANPV/custom_analytics
  }

  ngOnInit(): void {
    this.angularMqttService.message$.subscribe((res:any)=>{ this.processMqttMessage(res) })
  }

  processMqttMessage(res:any) {
    //console.log(res);
    if (res?.outputs) {
      if (res.outputs.find((el:any)=>{ return el.class == 0 })) {
        this.alert = true
      } else {
        this.alert = false
      }
    }

    //aoa-test
    // if (res?.azim) {
    //   let returnMessage: Message = {
    //     "azim": res.azim,
    //     "azim_std": res.azim_std,
    //     "elev": res.elev,
    //     "elev_std": res.elev_std,
    //     "timestamp": res.timestamp,
    //     "tag-ble-id": res["tag-ble-id"],
    //   }
    //   let tagPosition: Position = {
    //     "tag-ble-id" : returnMessage['tag-ble-id'],
    //     "x" : -(Math.sin(this.degreesToRadians(returnMessage.azim))),
    //     "y" : 0,
    //     "lastX": 0,
    //     "lastY": 0,
    //   }
    //   this.lastMsg = tagPosition
    // }
  }

  degreesToRadians(degrees:number) {
    var pi = Math.PI;
    return degrees * (pi/180);
  }
 
}
