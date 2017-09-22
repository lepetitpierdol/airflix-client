import {Component} from '@angular/core';
import {SocketService} from '../../services/socket';

@Component({
  selector: 'start-options',
  template: require('./start-options.html')
})
export class StartOptionsComponent {
  private createModalKey: string;
  private modalState: boolean = false;

  constructor(private socketService: SocketService) {

  }

  private createSession(): void {
    this.socketService.requestConnectionKey()
      .then((key: string) => {
        this.createModalKey = key;
        this.modalState = true;
      })
    ;
  }

  private joinSession(): void {
    this.createModalKey = undefined;
    this.modalState = true; 
  }

  private onModalClose(): void {
    this.modalState = false;
    
    if (this.createModalKey) {
      this.socketService.revokeMyKey(this.createModalKey);
    }
  }
}