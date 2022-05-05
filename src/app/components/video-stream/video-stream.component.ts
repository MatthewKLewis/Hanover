import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
//import { loadPlayer, Player } from 'rtsp-relay/browser';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
})
export class VideoStreamComponent implements AfterViewInit {
  /** the instance of the rtsp-relay client */
  //player?: Player;

  @ViewChild('videoPlayer')
  videoPlayer?: ElementRef<HTMLCanvasElement>;

  async ngAfterViewInit() {
    // this will wait until the connection is established
    // this.player = await loadPlayer({
    //   url: 'ws://localhost:2000/api/stream',
    //   canvas: this.videoPlayer!.nativeElement,

    //   // optional
    //   onDisconnect: () => console.log('Connection lost!'),
    // });

    //console.log('Connected!', this.player);
  }
}
