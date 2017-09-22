import {Component, Input, Output, EventEmitter} from '@angular/core';
import {SocketService} from '../../services/socket';

@Component({
  selector: 'modal',
  template: require('./modal.html')
})
export class ModalComponent {
  private keyInputValue: string;
  private error: boolean;

  @Input('type') type: string;
  @Output('onClose') onClose: EventEmitter<undefined> = new EventEmitter();

  constructor(private socketService: SocketService) {

  }

  @Input('key') set onKeySet(key: string) {
    this.keyInputValue = key;
  };

  private close(): void {
    this.onClose.emit();
  }

  private action(): void {
    this.socketService.joinSession(this.keyInputValue)
      .then((reply: boolean) => {
        if (!reply) {
          this.error = true;
        }
      })
    ;
  }
  
  private onKeyChange(): void {
    this.error = false;
  }
}