import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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

  @Input() input: Message = {
    "azim": 0,
      "azim_std": 0,
      "elev": 0,
      "elev_std": 0,
      "timestamp": 0,
      "tag-ble-id": "error"
  };

  pinsMap: Map<string, any> = new Map<string, any>();

  constructor() {  }
  
  ngOnInit(): void {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input'].currentValue) {
      this.updatePinPositions(changes['input'].currentValue);
    }
  }

  updatePinPositions(newPs: any) {
    if (newPs["tag-ble-id"] != "error") {
      this.pinsMap.set(newPs["tag-ble-id"], {...newPs, highest: 0, lowest: 360})
    }
  }
}
