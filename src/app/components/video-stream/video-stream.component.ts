import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnInit {

  @ViewChild('streaming', {static: false}) streamingcanvas?: ElementRef; 

  constructor() {
  }

  ngOnInit(): void {
  }

}
