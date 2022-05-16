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

  colorScheme: any = {
    domain: ['#E44D25', '#7aa3e5', '#a8385d', '#aae3f5']
  };

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
  quota: number = 50;
  inventoryRemaining: number = 100;
  timeLastTakted: number = 0;

  update$: Subject<any> = new Subject();

  // COMPLETION STATS
  pieData: any = [
    {
      "name": "Complete",
      "value": 0,
    },
    {
      "name": "Quota",
      "value": this.quota,
    },
    {
      "name": "Inventory",
      "value": this.inventoryRemaining,
    },
  ]

  // TAKT STATS
  taktTimes: any = [
    {
      name: "Takt Times",
      series: []
    }
  ]
  taktAverages: any = [
    {
      "name": "Last Takt",
      "value": 0,
    },
    {
      "name": "Average Takt",
      "value": 0,
    },
  ]
  
  constructor() {
    this.timeLastTakted = Date.now();
  }

  ngOnInit(): void {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      //console.log(changes['input'].currentValue["tag-ble-id"]); //get tag ids
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

      this.pieData[0].value = this.goodsTowardsQuota;
      this.pieData[1].value = this.quota - this.goodsTowardsQuota;
      this.pieData[2].value = this.inventoryRemaining - this.goodsTowardsQuota;
      this.pieData = [...this.pieData];

    }
  }

  averageTaktTime() {
    if (this.taktTimes[0].series.length > 0) {
      var total = 0;
      var avg = 0;
      if (this.taktTimes[0].series.length < 20) {
        for(var i = 0; i < this.taktTimes[0].series.length; i++) {
            total += this.taktTimes[0].series[i].value;
            var avg = total / this.taktTimes[0].series.length;
          }
        } else {
          for(var i = this.taktTimes[0].series.length - 20; i < this.taktTimes[0].series.length; i++) {
            total += this.taktTimes[0].series[i].value;
            var avg = total / 20;
        }
      }
      return avg;
    } 
    else {
      return 0;
    }
  }

  markTaktTime() {
    let latestTakt = (Date.now() - this.timeLastTakted) / 1000
    this.taktTimes[0].series.push({
      value: latestTakt,
      name: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    });

    if (this.taktTimes[0].series.length > 20) {
      console.log("slicing!");
      this.taktTimes[0].series = this.taktTimes[0].series.slice(this.taktTimes[0].series.length - 20, this.taktTimes[0].series.length)
    }
    this.taktTimes = [...this.taktTimes];

    this.taktAverages[0].value = latestTakt //last
    this.taktAverages[1].value = this.averageTaktTime() //avg
    this.taktAverages = [...this.taktAverages];

    this.timeLastTakted = Date.now();
  }

  reset() {
    location.reload();
    // this.unfinishedGoods = 0;
    // this.finishedGoods = 0;
    // this.goodsTowardsQuota = 0;
    // this.tagPositionMap.clear();

    // this.taktTimes  = [
    //   {
    //     name: "Takt Times",
    //     series: []
    //   }
    // ]

    // this.taktAverages = [
    //   {
    //     "name": "Last Takt",
    //     "value": 0,
    //   },
    //   {
    //     "name": "Average Takt",
    //     "value": 0,
    //   },
    // ]

    // this.pieData = [
    //   {
    //     "name": "Complete",
    //     "value": 0,
    //   },
    //   {
    //     "name": "Quota",
    //     "value": this.inventoryRemaining,
    //   },
    //   {
    //     "name": "Inventory",
    //     "value": this.inventoryRemaining,
    //   },
    // ]
  }
}
