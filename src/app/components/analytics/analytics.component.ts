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
    "lastX": -1,
    "lastY": -1,
  };

  tagPositionMap: Map<string, Position> = new Map<string, Position>();

  //stats
  unfinishedGoods: number = 0;
  finishedGoods: number = 0;
  goodsTowardsQuota: number = 0;
  quota: number = 100;
  taktTime: number = 0;
  timeLastTakted: number = 0;

  constructor() {
    this.timeLastTakted = Date.now();
  }

  ngOnInit(): void {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      this.updatePinPositions(changes['input'].currentValue);
    } else {
      //console.log('change to something else');
    }
  }

  updatePinPositions(newPs: any) {
    if (newPs["tag-ble-id"] != "error") {
      let newUnfinGoods = 0;
      let newFinGoods = 0;
      let lastX: number = this.tagPositionMap.get(newPs["tag-ble-id"])?.x || -1
      let lastY: number = this.tagPositionMap.get(newPs["tag-ble-id"])?.y || -1

      this.tagPositionMap.set(newPs["tag-ble-id"], {
        "tag-ble-id" : newPs["tag-ble-id"],
        "x": newPs.x,
        "y": newPs.y,
        "lastX": lastX,
        "lastY": lastY,
      })

      //PER MESSAGE
      if (newPs.x > 0 && lastX < 0) { 
        this.goodsTowardsQuota++;
        this.markTaktTime()
      }

      //CHECK ALL
      this.tagPositionMap.forEach((tagP: Position)=>{
        if (tagP.x > 0) newFinGoods++;
        if (tagP.x < 0) newUnfinGoods++;
      })
      
      this.unfinishedGoods = newUnfinGoods;
      this.finishedGoods = newFinGoods;
    }
  }

  markTaktTime() {
    this.taktTime = Date.now() - this.timeLastTakted;
    this.timeLastTakted = Date.now();
  }

  reset() {
    this.unfinishedGoods = 0;
    this.finishedGoods = 0;
    this.goodsTowardsQuota = 0;
    this.taktTime = 60;

    this.tagPositionMap.clear();
  }
}
