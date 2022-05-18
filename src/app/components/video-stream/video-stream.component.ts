import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { loadPlayer, Player } from 'rtsp-relay/browser';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
})
export class VideoStreamComponent implements AfterViewInit {
  //player?: Player;

  //@ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLCanvasElement>;

  async ngAfterViewInit() {
    console.log(location.host);
    // this.player = await loadPlayer({
    //   //url: 'ws://' + location.host + '/api/stream',
    //   url: 'ws://' + 'localhost:2000' + '/api/stream',
    //   canvas: this.videoPlayer!.nativeElement,
    // });
    //console.log('Connected!', this.player);
  }
}
