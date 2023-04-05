import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Position } from 'src/app/services/angularMqtt.service';

@Component({
  selector: 'app-himss-analytics',
  templateUrl: './himss-analytics.component.html',
  styleUrls: ['./himss-analytics.component.scss'],
})
export class HimssAnalyticsComponent implements OnInit {
  @Input() input: Position = {
    'tag-ble-id': 'error',
    x: 0,
    y: 0,
    lastX: -1,
    lastY: -1,
  };
  @Input() alert: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('HIMSS Analytics');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      console.log(changes['input'].currentValue['tag-ble-id']); //get tag ids
    } 
    else if (changes['alert']) {
      console.log('change to alert');
    }
  }
}
