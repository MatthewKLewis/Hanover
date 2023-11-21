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
import { AngularMqttService } from '../../services/angularMqtt.service'

// const MAP_COEFFICIENT = 200;
// const MAP_OFFSET = 420;

@Component({
  selector: 'app-shelf-map',
  template: `<div class="map" id="map">{{ errorMessage }}</div>`,
  styleUrls: ['./shelf-map.component.scss'],
})
export class ShelfMapComponent implements OnInit {

  errorMessage: string = '';
  mapId: number = 14722;
  mapWidth: number = 947; //600 //947
  mapHeight: number = 536; //600 //536

  tagPositionMap: Map<string, any> = new Map<string, any>();
  pinFeatures: any[] = [];
  pinLayer?: Layer;

  map!: OpMap;

  constructor(public angularMqttService: AngularMqttService, public mapService: MapService) {}

  ngOnInit(): void {
    this.drawMap();
    this.angularMqttService.positions$.subscribe((res:any)=>{ this.updatePinPositions(res)})
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
        layers: [
          tileLayer, 
          this.pinLayer
        ],
        target: mapElement,
        view: mapView,
      });
      this.map.once('postrender', ()=>{
        console.log('map rendered, start animation')
        setTimeout(()=>{
          this.map.updateSize();
        }, 1200)
        setInterval(()=>{
          this.map?.getAllLayers()[1].setSource(new VectorSource({ features: this.processPins() }))
        }, 1000)
      })
    } 
    else {
      console.log('map failed to draw.');
    }
  }

  updatePinPositions(msg: any) {
    if (msg && msg.pos.mapID == this.mapId) {
      console.log(msg)
      this.tagPositionMap.set(msg.MAC, [msg.pos.x, msg.pos.y])
      this.map?.getAllLayers()[1].setSource(new VectorSource({ features: this.processPins() }))
    }
  }

  processPins(): any[] {
    let pinFeats: any[] = []
    let index = 0;
    this.tagPositionMap.forEach((value: any, key: any)=>{
      index++;
      pinFeats.push(this.mapService.createIconStaffFeature({
        MAC: key,
        x: value[0],
        y: value[1],
      }))
    })
    //console.log(pinFeats)
    return pinFeats;
  }  
}
