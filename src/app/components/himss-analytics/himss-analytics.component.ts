import { Component, OnInit} from '@angular/core';
import { AngularMqttService } from 'src/app/services/angularMqtt.service';

@Component({
  selector: 'app-himss-analytics',
  templateUrl: './himss-analytics.component.html',
  styleUrls: ['./himss-analytics.component.scss'],
})
export class HimssAnalyticsComponent implements OnInit {

  detections: any[] = []
  contraindicationWarning: boolean = false;

  constructor(public angularMqttService: AngularMqttService) {
    this.detections = [];
  }

  ngOnInit(): void {
    this.angularMqttService.machineVisions$.subscribe((res:any)=>{ this.processMqttMessage(res); })
  }

  processMqttMessage(msg: any) {
    this.detections = msg?.outputs;

    if (this.detections) {
      this.detections = this.detections.sort((a: any, b: any) => { return a.class - b.class })
      
      this.contraindicationWarning = false;
      for (let i = 0; i < this.detections.length; i++) {
        if (this.detections[i].class === 0) {
          this.contraindicationWarning = true;
        }        
      }
    }
  }
}
