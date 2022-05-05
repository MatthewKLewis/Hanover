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

  // RENDERING
  infraIconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: IconAnchorUnits.FRACTION,
      anchorYUnits: IconAnchorUnits.FRACTION,
      src: './assets/images/ICON.png',
    }),
  });
  infraIconStyle_New = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: IconAnchorUnits.FRACTION,
      anchorYUnits: IconAnchorUnits.FRACTION,
      src: './assets/images/ICON_NEW.png',
    }),
  });
  invisibleIconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: IconAnchorUnits.FRACTION,
      anchorYUnits: IconAnchorUnits.FRACTION,
      src: './assets/images/invis.png',
    }),
  });
  drawStyle = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 1,
    }),
  });

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

  createAlertEventFeature(icon: any) {
    var textStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: './assets/images/alert.gif',
      }),
      text: new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        font: '12px Arial',
        text: icon.Name,
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'white', width: 1 }),
        offsetX: 0,
        offsetY: 0,
        placement: 'POINT',
        overflow: false,
      }),
    });
    var tempFeature = new Feature({
      geometry: new Point([icon.X, icon.Y, icon.X, icon.Y]),
      Name: icon.Name,
      UniqueId: icon.UniqueId,
      Status: icon.Status,
    });
    tempFeature.setStyle(textStyle);
    return tempFeature;
  }

  createIconStaffFeature(staff: any) {
    var textStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: staff.Icon || './assets/icons/star.png',
      }),
      text: new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        font: '18px Arial',
        text: staff.Name || "Pin",
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'white', width: 1 }),
        offsetX: 0,
        offsetY: 0,
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
