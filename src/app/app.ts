import {Component} from '@angular/core';
import {SocketService} from './common/services/socket';

@Component({
  selector: 'airflix-app',
  template: require('./app.html')
})
export class AppComponent {
  private connectionEstablished: boolean;

  constructor(private socketService: SocketService) {
    this.socketService.init();

    this.socketService.listenForConnectionResolve()
      .then(() => {
        this.connectionEstablished = true;
      })
    ;
  }
}