import { Component, Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/services/angularMqtt.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {

  @Input() input: Message = {x: 0, y: 0, z: 0};

  constructor() {  }
  
  ngOnInit(): void {  }
}
