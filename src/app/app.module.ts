import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShelfMapComponent } from './components/shelf-map/shelf-map.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { VideoStreamComponent } from './components/video-stream/video-stream.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ShelfMapComponent,
    AnalyticsComponent,
    VideoStreamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
