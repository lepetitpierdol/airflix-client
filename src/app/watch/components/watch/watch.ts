import {Component, ElementRef, ViewChild} from '@angular/core';
import {YoutubePlayerService} from '../../../youtube/services/player';
import {SocketService} from '../../../common/services/socket';
import {VideoData} from '../../interfaces/video';

@Component({
  selector: 'watch',
  template: require('./watch.html')
})
export class WatchComponent {
  private player: any;
  private link: string;

  private proposalError: boolean;
  private proposalSuccess: boolean;

  private proposals: Array<VideoData> = [];
  private activeVideo: VideoData;
  private bufferingPause: boolean;
  private previousPlayerState: number;

  @ViewChild('playerElement') playerElement: ElementRef;

  constructor(private socketService: SocketService, private playerService: YoutubePlayerService) {
    this.playerService.onYoutubeReady()
      .then(() => {
        this.player = new YT.Player(this.playerElement.nativeElement, {
          events: {
            onReady: () => {
              this.socketService.videoReady();
            },
            onStateChange: (e) => {
              if (this.previousPlayerState === 2 && e.data === 3) {
                this.socketService.videoSeek(e.target.getCurrentTime());
              }
    
              if (e.data === 2) {
                this.socketService.videoPause();
                this.player.pauseVideo();
              }
    
              if (this.previousPlayerState === 2 && e.data === 1) {
                this.socketService.videoPlay();
              }
    
              this.previousPlayerState = e.data;
            }
          }
        });

        this.socketService.observe('videoProposalReceive')
          .subscribe((videoProposal: VideoData) => {
            this.onVideoProposalReceive(videoProposal);
          })
        ;

        this.socketService.observe('videoPlay')
          .subscribe(() => {
            if (this.activeVideo) {
              this.player.playVideo();
            }
          })
        ;

        this.socketService.observe('videoStart')
          .subscribe((video: VideoData) => {
            this.activeVideo = video;
            this.preparePlayer();
          })
        ;

        this.socketService.observe('videoSeek')
          .subscribe((seconds: number) => {
            this.player.seekTo(seconds);
          })
        ;

        this.socketService.observe('videoPause')
          .subscribe(() => {
            this.player.pauseVideo();
          })
        ;
      })
    ;

    this.playerService.inject();
  }
  
  private preparePlayer(): void {
    this.player.loadVideoById(this.activeVideo.id);
  }

  private proposeLink(): void {
    this.proposalError = false;

    this.socketService.proposeVideo(this.link)
      .then(() => {
        this.link = '';
        this.proposalSuccess = true;
      })
      .catch(() => {
        this.proposalError = true;
      })
    ;
  }

  private onVideoProposalReceive(videoProposal: VideoData): void {
    this.proposals.unshift(videoProposal);
  }

  private acceptProposal(videoProposal: VideoData) {
    this.socketService.acceptProposal(videoProposal)
      .then(() => {

      })
      .catch(() => {
        this.proposalError = true;
      })
    ;
  }
}