import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShelfMapComponent } from './components/shelf-map/shelf-map.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { VideoStreamComponent } from './components/video-stream/video-stream.component';
import { HimssAnalyticsComponent } from './components/himss-analytics/himss-analytics.component';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
};

@NgModule({
  declarations: [
    AppComponent,
    ShelfMapComponent,
    AnalyticsComponent,
    VideoStreamComponent,
    HimssAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    BrowserModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
