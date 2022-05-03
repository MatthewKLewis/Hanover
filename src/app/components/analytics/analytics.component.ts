import { Component, OnInit } from '@angular/core';
import { MqttService } from 'src/app/services/mqtt.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(public mqttService: MqttService) { }

  ngOnInit(): void {
    this.mqttService.shayanBehaviorSubject.subscribe((msg:any)=>{
      console.log(msg);
    })
  }

}
