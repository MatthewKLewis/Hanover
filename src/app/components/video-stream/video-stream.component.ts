import { Component, AfterViewInit} from '@angular/core';
//import { loadPlayer, Player } from 'rtsp-relay/browser';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
})
export class VideoStreamComponent implements AfterViewInit {
  //@ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLCanvasElement>;

  async ngAfterViewInit() {
    //console.log(location.host);
  }
}
