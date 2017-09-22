import {Injectable} from '@angular/core';
import {Config} from '../../../config';
import {VideoData} from '../../watch/interfaces/video'
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private io: any;

  public init(): void {
    this.io = io(Config.socketHost);
  }

  public requestConnectionKey(): Promise<string> {
    this.io.emit('requestConnectionKey');

    return new Promise((resolve) => {
      this.io.on('connectionKeyReceive', (key: string) => {
        this.io.off('connectionKeyReceive');
        resolve(key);
      });
    });
  }

  public listenForConnectionResolve(): Promise<undefined> {
    return new Promise((resolve) => {
      this.io.on('connectionWithPartnerResolve', function() {
        this.io.off('connectionWithPartnerResolve');
        resolve();
      })
    });
  }

  public joinSession(key: string): Promise<boolean> {
    this.io.emit('joinSession', key);

    return new Promise((resolve) => {
      this.io.on('joinSessionReply', (reply: boolean) => {
        this.io.off('joinSessionReply');
        resolve(reply);
      });
    });
  }

  public revokeMyKey(key: string): void {
    this.io.emit('revokeMyConnectionKey', key);
  }

  public proposeVideo(link: string): Promise<string | boolean> {
    this.io.emit('videoProposal', link);

    return new Promise((resolve, reject) => {
      this.io.on('videoProposalResolve', (reply: string | boolean) => {
        this.io.off('videoProposalResolve');
        if (reply === true) {
          resolve(true);
        } else {
          reject(reply);
        }
      });
    });
  }

  public acceptProposal(videoProposal: VideoData): Promise<string | boolean> {
    this.io.emit('videoProposalAccept', videoProposal);

    return new Promise((resolve, reject) => {
      this.io.on('videoProposalAcceptResolve', (reply) => {
        this.io.off('videoProposalAcceptResolve');

        if (reply) {
          return resolve(true);
        } else {
          return reject(reply);
        }
      });
    });
  }

  public videoReady(): void {
    this.io.emit('videoReady');
  }

  public videoPlay(): void {
    this.io.emit('videoPlay');
  }

  public observe(eventName: string): Observable<any> {
    return new Observable(observer => {
      this.io.on(eventName, function(data) {
        observer.next(data);
      });
    });
  }

  public videoSeek(seconds: number): void {
    this.io.emit('videoSeek', seconds);
  }

  public videoPause(): void {
    this.io.emit('videoPause');
  }
}