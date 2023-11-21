import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Icon from 'ol/style/Icon';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { Text } from 'ol/style';
import Polygon from 'ol/geom/Polygon';
import GeometryLayout from 'ol/geom/GeometryLayout';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { Observable } from 'rxjs';

const ICON_LIST = [
  "light_blue_.png",
  //"light_green_.png",
  //"light_yellow_.png",
  //"pink_.png",
  //"purple_.png",
  //"square_dark_blue_.png",
  //"square_dark_green_.png",
  "square_light_green_.png",
]
const ICON_MAP = new Map<string, string>();
ICON_MAP.set('C4CB6B702D19', "square_light_green_.png");
ICON_MAP.set('C4CB6B7021F4', "square_light_green_.png");
ICON_MAP.set('C4CB6B70303A', "square_orange_.png");
ICON_MAP.set('C4CB6B702D2F', "light_blue_.png");
ICON_MAP.set('C4CB6B7020D1', "light_blue_.png");
ICON_MAP.set('C4CB6B701E8F', "light_blue_.png");
ICON_MAP.set('C4CB6B7009D2', "triangle_yellow_.png");
ICON_MAP.set('C4CB6B701FBD', "triangle_yellow_.png");
ICON_MAP.set('C4CB6B703020', "triangle_yellow_.png");


@Injectable({
  providedIn: 'root',
})
export class MapService {

  customerId: number | undefined = 0;

  constructor( private http: HttpClient) { }

  initializeForInsert(newCustId: number) {
    this.customerId = newCustId;
  }

  // API
  getSiteHierarchy(): Observable<any> {
    return this.http.get<any>(
      `/api/MetaData/GetLocationHierarchy?CustomerId=${this.customerId}`,
      {}
    );
  }
  
  getMapById(id: number): Observable<any> {
    return this.http.get<any>(
      `/api/Maps/GetByMapId?MapId=${id}&CustomerId=${this.customerId}`,
      {}
    );
  }

  returnCustomZoneStyle(alertZone: boolean = false, text: string = "") {
    var strokeColor = 'rgba(0, 157, 255)'; //default blue
    var fillColor = 'rgba(0, 157, 255, 0.25)'; //default blue

    if (alertZone) {
      var strokeColor = 'Red'; //event red
      var fillColor = 'rgba(232, 19, 19, 0.364)'; //event red
    }

    if (text) {
      var tempStyle = new Style({
        text: new Text({
          textAlign: 'center',
          textBaseline: 'hanging',
          font: '14px Arial',
          text: text,
          fill: new Fill({ color: 'black' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
          offsetX: 0,
          offsetY: 0,
          placement: 'POINT',
          overflow: true,
        }),
        stroke: new Stroke({
          color: strokeColor,
          width: 1,
        }),
        fill: new Fill({
          color: fillColor,
        }),
        zIndex: 5,
      });
      return tempStyle;
    } else {
      var tempStyle = new Style({
        stroke: new Stroke({
          color: strokeColor,
          width: 1,
        }),
        fill: new Fill({
          color: fillColor,
        }),
        zIndex: 5,
      });
      return tempStyle;
    }
  }

  createIconStaffFeature(staff: any) {
    var textStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: staff.MAC == 'C4:CB:6B:71:76:DA' || staff.MAC == 'C4:CB:6B:70:08:CB' ? './assets/icons/square_orange_.png' : './assets/icons/light_blue_.png',
        scale: [1.5, 1.5],
      }),
      text: new Text({
        textAlign: 'center',
        textBaseline: 'bottom',
        font: '18px Arial',
        text: staff.MAC || "Pin",
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'white', width: 1 }),
        offsetX: 0,
        offsetY: -5,
        placement: 'POINT',
        overflow: false,
      }),
    });
    var tempFeature = new Feature({
      geometry: new Point([
        staff.x,
        -staff.y,
        staff.x,
        -staff.y,
      ]),
      Name: staff.Name,
      UniqueId: staff.UniqueId,
      Status: staff.Status,
      Id: staff.Id,
    });
    tempFeature.setStyle(textStyle);
    return tempFeature;
  }

  createZoneFeature(zone: any, style: any) {
    var tempZoneFeature = new Feature({
      FeatureType: 'zone',
      geometry: new Polygon(Array(zone.Polypoints), GeometryLayout.XY),
      Id: zone.Id,
      Name: zone.Name,
      point: Array(zone.Polypoints),
      type: zone.ZoneType,
    });
    tempZoneFeature.setStyle(style);
    return tempZoneFeature;
  }
}
