import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

// Components
import {AppComponent} from './app/app';
import {StartOptionsComponent} from './app/common/components/start-options/start-options';
import {ModalComponent} from './app/common/components/modal/modal';
import {WatchComponent} from './app/watch/components/watch/watch';

// Services
import {SocketService} from './app/common/services/socket';
import {YoutubePlayerService} from './app/youtube/services/player';

// Pipes
import {HumanizeDurationPipe} from './app/watch/pipes/humanize-duration';

@NgModule({
  declarations: [
    AppComponent,
    StartOptionsComponent,
    ModalComponent,
    WatchComponent,
    HumanizeDurationPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    SocketService,
    YoutubePlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
