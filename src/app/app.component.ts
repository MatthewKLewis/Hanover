import { Component } from '@angular/core';
import { AngularMqttService, Position } from './services/angularMqtt.service';

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
    //this.angularMqttService.subscribe('/merakimv/Q2JV-XAYQ-NSGH/custom_analytics'); ///merakimv/Q2EV-4RBE-ANPV/custom_analytics
  }

  ngOnInit(): void {  }

  // degreesToRadians(degrees:number) {
  //   var pi = Math.PI;
  //   return degrees * (pi/180);
  // }
 
}
