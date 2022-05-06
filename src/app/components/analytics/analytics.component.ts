import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Injectable } from '@angular/core';
import { Message, Position } from 'src/app/services/angularMqtt.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  @Input() input: Position = {
    "tag-ble-id": 'error',
    "x": 0,
    "y": 0,
  };

  tagPositionMap: Map<string, any> = new Map<string, any>();

  //stats
  unfinishedGoods: number = 0;
  finishedGoods: number = 0;

  goodsTowardsQuota: number = 0;
  quota: number = 0;

  inventoryConsumed: number = 0;
  taktTime: number = 60;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.crunchStats();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      this.updatePinPositions(changes['input'].currentValue);
    } else {
      //console.log('change to something else');
    }
  }

  crunchStats() {}

  updatePinPositions(newPs: any) {
    if (newPs['tag-ble-id'] != 'error') {
      this.tagPositionMap.set(newPs['tag-ble-id'], newPs);
      //console.log(this.tagPositionMap);
    }
  }

  reset() {
    this.unfinishedGoods = 0;
    this.finishedGoods = 0;
    this.goodsTowardsQuota = 0;
    this.inventoryConsumed = 0;
    this.taktTime = 60;

    this.tagPositionMap.clear();
  }
}
