import { Component, Input, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Feature, Map as OpMap, View } from 'ol/';
import { Zoomify } from 'ol/source';
import { getCenter } from 'ol/extent';
import { ZoomSlider } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Projection from 'ol/proj/Projection';

@Component({
  selector: 'app-shelf-map',
  template: `<div class="map" id="map">{{errorMessage}}</div>`,
  styleUrls: ['./shelf-map.component.scss']
})
export class SharedMapComponent implements OnInit {

  @Input() data: any;
  @Input() customerId: number = 0;
  @Input() inputType: string = 'error!';

  errorMessage: string = '';
  mapId: number = 0;
  mapData: any;
  zones: any
  zoneFeatures: any[] = []
  pinFeature: any;

  constructor(public mapService: MapService) { }

  ngOnInit(): void {
    //console.log(this.data)
    this.mapId = this.extractMapId(this.data);
    this.pinFeature = this.extractPinFeature(this.data);
    this.drawMap(1);
  }
  drawMap(res: any) { //side effects
    this.mapData = res;
    this.processZones(this.mapData.Zones);
    var extent: any = [0, 0, this.mapData.Width, -this.mapData.Height];
    var projection = new Projection({
      code: 'EPSG:4326',
      units: 'pixels',
      extent: [0, 0, this.mapData.Width, -this.mapData.Height],
    });
    var tileLayer = new TileLayer({
      source: new Zoomify({
        url: `../maps/${this.mapData.ModelId}/${this.mapData.ModelId}/`,
        size: [this.mapData.Width, this.mapData.Height],
      }),
    });
    var zoneLayer = new VectorLayer({
      source: new VectorSource({ features: this.zoneFeatures }),
    });
    var vectorPinLayer = new VectorLayer({
      source: new VectorSource({ features: [this.pinFeature] }),
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
        layers: [tileLayer, zoneLayer, vectorPinLayer],
        target: mapElement,
        view: mapView,
      });
      var zoomslider = new ZoomSlider();
      map.addControl(zoomslider);
      map.on('pointermove', (event: any) => {
        var layer = <any>map.getLayers().getArray()[1]
        var feats = layer.getSource().getFeatures();
        for (let i = 0; i < feats.length; i++) {
          feats[i].setStyle(this.mapService.returnCustomZoneStyle(false))
        }
        map.forEachFeatureAtPixel(event.pixel, (feature: any) => {
          if (feature &&feature?.values_?.FeatureType == 'zone') {
            feature.setStyle(this.mapService.returnCustomZoneStyle(false, feature?.values_?.Name))
          }
        });
      });
      map.once('postrender', () => {
        var breakdown = <any>this.pinFeature;
        mapView.fit(breakdown.values_.geometry, {
          padding: [400, 400, 400, 400],
        });
        console.log("Zoomed in on asset")
      });
    }
    else {
      console.log('map failed to draw.')
    }

  }
  extractMapId(anyData: any): number {
    let returnNumber = 0
    switch (this.inputType) {
      case "asset":
        returnNumber = anyData.CurrentMapId
        break;
      case "device":
        returnNumber = anyData.MapId
        break;
      case "infra":
        returnNumber = anyData.MapId //re-mapped from ModelId
        break;
      default:
        returnNumber = 0;
        break;
    }
    return returnNumber;
  }
  extractPinFeature(anyData: any): Feature | null {
    let returnFeature;
    let altObject = {}
    switch (this.inputType) {
      case "asset":
        returnFeature = this.mapService.createIconStaffFeature(anyData);
        break;
      case "device":
        altObject = {
          CurrentX: anyData.XCoordinate,
          CurrentY: anyData.YCoordinate,
          Name: anyData.UniqueId || "Device",
          Id: anyData.Id
        }
        returnFeature = this.mapService.createIconStaffFeature(altObject);
        break;
      case "infra":
        altObject = {
          CurrentX: anyData.X,
          CurrentY: anyData.Y,
          Name: anyData.UniqueId || "Infra",
          Id: anyData.Id
        }
        returnFeature = this.mapService.createIconStaffFeature(altObject);
        break;
      default:
        returnFeature = null;
        break;
    }
    //console.log(returnFeature)
    return returnFeature;
  }
  processZones(zones: any) { //side effects
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
