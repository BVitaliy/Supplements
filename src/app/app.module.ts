import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { enterAnimation } from './core/animations/animationNavigation';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { environment } from 'src/environments/environment';
// import { getAuth, provideAuth } from '@angular/fire/auth';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      hardwareBackButton: true,
      swipeBackEnabled: false,
      rippleEffect: true,
      navAnimation: enterAnimation,
    }),
    AppRoutingModule,
    // provideFirebaseApp(() => initializeApp(environment?.google)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
 

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
