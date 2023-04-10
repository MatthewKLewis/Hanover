import { Component } from '@angular/core';
import { AngularMqttService, Position } from './services/angularMqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
  ngOnInit(): void { }
}
