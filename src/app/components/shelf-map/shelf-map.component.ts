import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { MapService } from '../../services/map.service';
import { Map as OpMap, View } from 'ol/';
import { Zoomify } from 'ol/source';
import { getCenter } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Projection from 'ol/proj/Projection';
import Layer from 'ol/layer/Layer';
import { Position } from '../../services/angularMqtt.service'

const MAP_COEFFICIENT = 200;
const MAP_OFFSET = 420; //420 is the distance in pixels from origin-X to center-table-X

@Component({
  selector: 'app-shelf-map',
  template: `<div class="map" id="map">{{ errorMessage }}</div>`,
  styleUrls: ['./shelf-map.component.scss'],
})
export class ShelfMapComponent implements OnInit {

  @Input() input: Position = {
    "tag-ble-id" : "error",
    "x" : 0,
    "y" : 0,
    "lastX": -1,
    "lastY": -1,
  };

  errorMessage: string = '';
  mapId: number = 12734;
  mapWidth: number = 600;
  mapHeight: number = 600;

  zones: any[] = [];
  zoneFeatures: any[] = [];
  zoneLayer?: Layer;

  tagPositionMap: Map<string, Position> = new Map<string, Position>();
  pinFeatures: any[] = [];
  pinLayer?: Layer;

  map?: OpMap;

  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    this.drawMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      this.updatePinPositions(changes['input'].currentValue);
    }
    else {
      //console.log('change to something else');
    }
  }

  //Side Effects Functions

  drawMap() {
    var extent: any = [0, 0, this.mapWidth, -this.mapHeight];
    var projection = new Projection({
      code: 'EPSG:4326',
      units: 'pixels',
      extent: [0, 0, this.mapWidth, -this.mapHeight],
    });
    var tileLayer = new TileLayer({
      source: new Zoomify({
        url: `../../../assets/maps/${this.mapId}/${this.mapId}/`,
        size: [this.mapWidth, this.mapHeight],
      }),
    });
    this.zoneLayer = new VectorLayer({
      source: new VectorSource({ features: this.zoneFeatures }),
    });
    this.pinLayer = new VectorLayer({
      source: new VectorSource({ features: this.pinFeatures }),
    });
    var oldmap = document.querySelector('#map');
    while (oldmap?.firstChild) {
      oldmap.removeChild(oldmap.firstChild);
    }
    var mapView = new View({
      projection: projection,
      center: getCenter(extent),
      zoom: 0,
      maxZoom: 2,
    });
    const mapElement = <HTMLElement>document.querySelector('#map');
    if (mapElement) {
      this.map = new OpMap({
        layers: [tileLayer, this.zoneLayer, this.pinLayer],
        target: mapElement,
        view: mapView,
      });
      this.map.once('postrender', ()=>{
        console.log('map rendered, start animation')
        setInterval(()=>{
          this.map?.getAllLayers()[2].setSource(new VectorSource({ features: this.processPins() }))
        }, 1000)
      })
    } 
    else {
      console.log('map failed to draw.');
    }
  }

  updatePinPositions(newPs: any) {
    if (newPs["tag-ble-id"] != "error") {
      this.tagPositionMap.set(newPs["tag-ble-id"], {
        ...newPs,
        "lastX": this.tagPositionMap.get(newPs["tag-ble-id"])?.x,
        "lastY": this.tagPositionMap.get(newPs["tag-ble-id"])?.y,
      })
    }
    //this.map?.getAllLayers()[2].setSource(new VectorSource({ features: this.processPins() }))
  }

  //I/O Functions

  degreesToRadians(degrees:number) {
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  processPins(): any[] {
    let pinFeats: any[] = []
    let index = 0;
    this.tagPositionMap.forEach((pin: Position)=>{
      index++;
      pinFeats.push(this.mapService.createIconStaffFeature({
        x: (pin["x"] * MAP_COEFFICIENT) + MAP_OFFSET,
        y: 5 + (index * 40),
        Name: pin["tag-ble-id"]
      }))
    })
    return pinFeats;
  }

  processZones(zones: any): any[] {
    let zoneFeats: any[] = [];
    for (var i = 0; i < zones.length; i++) {
      if (zones[i].Polypoints[zones[i].Polypoints.length - 1] == ';') {
        zones[i].Polypoints = zones[i].Polypoints.slice(0, -1);
      }
      zones[i].Polypoints = zones[i].Polypoints.split(';');
      for (var j = 0; j < zones[i].Polypoints.length; j++) {
        zones[i].Polypoints[j] = zones[i].Polypoints[j].split(',');
        zones[i].Polypoints[j][0] = <Number>zones[i].Polypoints[j][0];
        zones[i].Polypoints[j][1] = -(<Number>zones[i].Polypoints[j][1]); //YNEG
      }
    }
    for (let i = 0; i < zones.length; i++) {
      zoneFeats.push(
        this.mapService.createZoneFeature(
          this.zones[i],
          this.mapService.returnCustomZoneStyle()
        )
      );
    }
    return zoneFeats;
  }
}
