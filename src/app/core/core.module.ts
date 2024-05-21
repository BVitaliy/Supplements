import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { httpInterceptorProviders } from './interceptors';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
// import { Network } from '@ionic-native/network/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// import { MultipleDocumentsPicker } from '@ionic-native/multiple-document-picker/ngx';
import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { FirebaseAppModule } from '@angular/fire/app';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgxMaskModule.forRoot(maskConfig),
    IonicStorageModule.forRoot({
      name: '__Supplement',
      driverOrder: [
        Drivers.SecureStorage,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    }),
  ],
  exports: [],
  providers: [
    httpInterceptorProviders,
    HttpClient,
    HttpClientModule,
    HttpClientJsonpModule,
    DatePipe,
    ScreenOrientation,
    Network,
    AppVersion,
    MultipleDocumentsPicker,
    AndroidPermissions,
    AndroidPermissions,
    FirebaseAppModule,
    File,
    Camera,
    BarcodeScanner,
  ],
})
export class CoreModule {}
