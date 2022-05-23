import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Injectable } from '@angular/core';
import { Position } from 'src/app/services/angularMqtt.service';
import { format, sub } from 'date-fns';
import { NumberCardComponent, GaugeComponent, LineChartComponent } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})

export class AnalyticsComponent implements OnInit {

  colorScheme: any = { domain: ['#1565c0', '#7aa3e5', '#a8385d', '#aae3f5'] };
  colorSchemeTwo: any = { domain: ['#e44d25', '#aae3f5'] };

  @ViewChildren(GaugeComponent) gauges!: GaugeComponent[];
  @ViewChildren(NumberCardComponent) cards!: NumberCardComponent[];
  @ViewChildren(LineChartComponent) lineCharts!: LineChartComponent[];

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

  // COMPLETION STATS
  completenessData: any = [
    {
      "name": "Complete",
      "value": 0,
    },
  ]
  quotaData: any = [
    {
      "name": "Quota",
      "value": this.quota,
    },
  ]
  inventoryData: any = [
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
  lastTakt: any = [
    {
      "name": "Last Takt Time",
      "value": 0,
    }
  ]

  //MALFUNCTION STAT
  malfunctionBoolean: any = [
    {
      "name": "Bad Part Identified",
      "value": 0,
    }
  ]

  constructor() {
    this.timeLastTakted = Date.now();
  }

  ngOnInit(): void { this.arrangeGraphs() }
  ngAfterViewInit(): void { this.arrangeGraphs() }

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
        "tag-ble-id": newPs["tag-ble-id"],
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
      this.tagPositionMap.forEach((tagP: Position) => {
        if (tagP.x > 0) newFinGoods++;
        if (tagP.x < 0) newUnfinGoods++;
      })

      this.unfinishedGoods = newUnfinGoods;
      this.finishedGoods = newFinGoods;

      this.completenessData[0].value = this.goodsTowardsQuota;
      this.completenessData = [...this.completenessData];

      this.quotaData[0].value = this.quota - this.goodsTowardsQuota;
      this.quotaData = [...this.quotaData];

      this.inventoryData[0].value = this.inventoryRemaining - this.goodsTowardsQuota;
      this.inventoryData = [...this.inventoryData];
    }
  }

  arrangeGraphs() {
    setTimeout(() => {
      this.gauges.forEach((gauge: GaugeComponent) => {
        gauge.margin = [60, 40, 10, 60];
        gauge.update();
      })
      this.cards.forEach((card: NumberCardComponent) => {
        card.view = [250, 150];
        card.update();
      })
      this.lineCharts.forEach((lineChart: LineChartComponent) => {
        lineChart.margin = [20, 0, 10, 0];
        lineChart.view = [400, 350];
        lineChart.update();
      })
    }, 0);
  }

  averageTaktTime() {
    if (this.taktTimes[0].series.length > 0) {
      var total = 0;
      var avg = 0;
      if (this.taktTimes[0].series.length < 20) {
        for (var i = 0; i < this.taktTimes[0].series.length; i++) {
          total += this.taktTimes[0].series[i].value;
          var avg = total / this.taktTimes[0].series.length;
        }
      } else {
        for (var i = this.taktTimes[0].series.length - 20; i < this.taktTimes[0].series.length; i++) {
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
      this.taktTimes[0].series = this.taktTimes[0].series.slice(this.taktTimes[0].series.length - 20, this.taktTimes[0].series.length)
    }
    this.taktTimes = [...this.taktTimes];

    this.lastTakt[0].value = latestTakt //last
    this.lastTakt = [...this.lastTakt];
    
    this.malfunctionBoolean[0].value = this.averageTaktTime() //avg
    this.malfunctionBoolean = [...this.malfunctionBoolean];

    this.timeLastTakted = Date.now();
  }

  reset() {
    location.reload();
  }
}
