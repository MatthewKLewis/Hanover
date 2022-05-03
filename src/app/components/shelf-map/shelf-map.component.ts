import {
  Component,
  Input,
  OnInit,
  OnChanges,
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

@Component({
  selector: 'app-shelf-map',
  template: `<div class="map" id="map">{{ errorMessage }}</div>`,
  styleUrls: ['./shelf-map.component.scss'],
})
export class ShelfMapComponent implements OnInit {
  @Input() input: any;
  @Input() customerId: number = 0;
  @Input() inputType: string = 'error!';

  errorMessage: string = '';
  mapId: number = 1;
  mapWidth: number = 600;
  mapHeight: number = 600;

  zones: any[] = [];
  zoneFeatures: any[] = [];
  zoneLayer?: Layer;

  pins: any[] = [{ x: 0, y: 0, z: 0 }];
  pinFeatures: any[] = [];
  pinLayer?: Layer;

  map?: OpMap;

  constructor(public mapService: MapService) {}

  ngOnInit(): void {
    this.drawMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input'].currentValue) {
      this.updatePinPositions(changes['input'].currentValue);
    }
  }

  //Side Effects Functions

  drawMap() {
    this.zoneFeatures = this.processZones(this.zones);
    this.pinFeatures = this.processPins(this.pins);
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
      maxZoom: 1,
    });
    const mapElement = <HTMLElement>document.querySelector('#map');
    if (mapElement) {
      this.map = new OpMap({
        layers: [tileLayer, this.zoneLayer, this.pinLayer],
        target: mapElement,
        view: mapView,
      });
    } else {
      console.log('map failed to draw.');
    }
  }

  updatePinPositions(newPositions: any) {
    this.map?.getAllLayers()[2].setSource(new VectorSource({ features: this.processPins([newPositions]) }))
  }

  //I/O Functions

  processPins(pins: any): any[] {
    let pinFeats: any[] = []
    for (let i = 0; i < pins.length; i++) {
      pinFeats.push(this.mapService.createIconStaffFeature(pins[i]));
    }
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
