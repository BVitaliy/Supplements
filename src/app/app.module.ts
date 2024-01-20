import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { enterAnimation } from './core/animations/animationNavigation';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      hardwareBackButton: false,
      swipeBackEnabled: false,
      rippleEffect: true,
      navAnimation: enterAnimation
    }),
    AppRoutingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
