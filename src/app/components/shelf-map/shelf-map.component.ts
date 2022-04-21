import { Component, Input, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Feature, Map as OpMap, View } from 'ol/';
import { Zoomify } from 'ol/source';
import { getCenter } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Projection from 'ol/proj/Projection';

@Component({
  selector: 'app-shelf-map',
  template: `<div class="map" id="map">{{errorMessage}}</div>`,
  styleUrls: ['./shelf-map.component.scss']
})
export class ShelfMapComponent implements OnInit {

  @Input() data: any;
  @Input() customerId: number = 0;
  @Input() inputType: string = 'error!';

  errorMessage: string = '';
  mapId: number = 1;
  mapWidth: number = 600;
  mapHeight: number = 600;
  
  zones: any[] = []
  zoneFeatures: any[] = []

  constructor(public mapService: MapService) { }

  ngOnInit(): void {
    this.drawMap();
  }

  drawMap() {
    this.processZones(this.zones);    
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
    var zoneLayer = new VectorLayer({
      source: new VectorSource({ features: this.zoneFeatures }),
    });
    var oldmap = document.querySelector('#map');
    while (oldmap?.firstChild) {
      oldmap.removeChild(oldmap.firstChild);
    }
    var mapView = new View({
      projection: projection,
      center: getCenter(extent),
      zoom: 0,
      maxZoom: 5,
    });
    const mapElement = <HTMLElement>document.querySelector('#map');
    if (mapElement) {
      var map = new OpMap({
        layers: [
          tileLayer, 
          zoneLayer,
        ],
        target: mapElement,
        view: mapView,
      });
    }
    else {
      console.log('map failed to draw.')
    }
  }

  processZones(zones: any) {
    for (var i = 0; i < zones.length; i++) {
      if (
        zones[i].Polypoints[zones[i].Polypoints.length - 1] == ';'
      ) {
        zones[i].Polypoints = zones[i].Polypoints.slice(0, -1);
      }
      zones[i].Polypoints = zones[i].Polypoints.split(';');
      for (var j = 0; j < zones[i].Polypoints.length; j++) {
        zones[i].Polypoints[j] =
          zones[i].Polypoints[j].split(',');
        zones[i].Polypoints[j][0] = <Number>(
          zones[i].Polypoints[j][0]
        );
        zones[i].Polypoints[j][1] = -(<Number>(
          zones[i].Polypoints[j][1]
        )); //YNEG
      }
    }
    this.zones = zones;
    for (let i = 0; i < this.zones.length; i++) {
      this.zoneFeatures.push(this.mapService.createZoneFeature(this.zones[i], this.mapService.returnCustomZoneStyle()));
    }
  }
}
