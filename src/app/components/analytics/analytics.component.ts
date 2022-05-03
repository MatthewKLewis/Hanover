import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularMqttService } from 'src/app/services/angularMqtt.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {

  lastMsg: string = "waiting..."

  constructor(public angularMqttService: AngularMqttService) {
    this.angularMqttService.subscribe('Test');
  }

  ngOnInit(): void {
    this.angularMqttService.message$.subscribe((msg:any)=>{
      console.log(msg);
      this.lastMsg = msg;
    })
  }

}
