import { Component } from '@angular/core';
import { AngularMqttService, Message } from './services/angularMqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  lastMsg: Message = {
    x: 0,
    y: 0,
    z: 0,
  }

  constructor(public angularMqttService: AngularMqttService) {
    this.angularMqttService.subscribe('Test');
  }

  ngOnInit(): void {
    this.angularMqttService.message$.subscribe((res:any)=>{ this.processMqttMessage(res) })
  }

  processMqttMessage(res:any) {
    if (res) {
      let returnMessage: Message = {
        x: res.x,
        y: res.y,
        z: res.z,
      }
      this.lastMsg = returnMessage
    }
    else {
      console.log('message$ update without response')
    }
  }
 
}
