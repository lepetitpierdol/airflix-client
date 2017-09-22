import {Injectable, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Injectable()
export class YoutubePlayerService {
  constructor(@Inject(DOCUMENT) private document: any) {
    
  }

  public inject(): void {
    if (this.document.querySelector('[data-player-script]')) {
      return;
    }

    window['YTConfig'] = {
      host: 'https://www.youtube.com' 
    } 

    var tag = this.document.createElement('script');
    
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.setAttribute('data-player-script', 'true');
    let firstScriptTag = this.document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  public onYoutubeReady(): Promise<undefined> {
    return new Promise((resolve) => {
      window['onYouTubeIframeAPIReady'] = function() {
        resolve();
      };
    });
  }
}