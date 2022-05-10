import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message, Position } from 'src/app/services/angularMqtt.service';
import { format, sub } from 'date-fns';


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
  timeLastTakted: number = 0;

  update$: Subject<any> = new Subject();

  taktTimes: any = [
    {
      name: "Takt Time",
      series: []
    }
  ]
  colorScheme: any = {
    domain: ['#E44D25', '#7aa3e5', '#a8385d', '#aae3f5']
  };

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

  averageTaktTime() {
    if (this.taktTimes[0].series.length > 0) {
      //console.log(this.taktTimes[0].series[1].value)
      return 0//this.taktTimes[0].series.reduce((a:any, b:any) => a.value + b.value);
    } else {
      return 0;
    }
  }

  markTaktTime() {
    this.taktTimes[0].series.push({
      value: (Date.now() - this.timeLastTakted) / 1000,
      name: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    });
    console.log(this.taktTimes)
    this.taktTimes = [...this.taktTimes];
    this.timeLastTakted = Date.now();
  }

  reset() {
    this.unfinishedGoods = 0;
    this.finishedGoods = 0;
    this.goodsTowardsQuota = 0;
    this.taktTimes = [];

    this.tagPositionMap.clear();
  }
}
