import {Injectable} from '@angular/core';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})

export class PermissionsService {

  constructor(
    private androidPermissions: AndroidPermissions
  ) {}

  requestPermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      (result: any) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.CAMERA,
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
            // this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
            // this.androidPermissions.PERMISSION.ACCESS_MEDIA_LOCATION,
            // this.androidPermissions.PERMISSION.CONTROL_LOCATION_UPDATES,
            // this.androidPermissions.PERMISSION.INSTALL_LOCATION_PROVIDER,
            // this.androidPermissions.PERMISSION.LOCATION_HARDWARE,
            this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION,
            this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
            this.androidPermissions.PERMISSION.RECORD_AUDIO,
            this.androidPermissions.PERMISSION.FOREGROUND_SERVICE_MICROPHONE,
            this.androidPermissions.PERMISSION.READ_MEDIA_VIDEO,
            this.androidPermissions.PERMISSION.ACCEPT_HANDOVER,
          ]);
        }
      },
      (error: any) => this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        // this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
        // this.androidPermissions.PERMISSION.ACCESS_MEDIA_LOCATION,
        // this.androidPermissions.PERMISSION.CONTROL_LOCATION_UPDATES,
        // this.androidPermissions.PERMISSION.INSTALL_LOCATION_PROVIDER,
        // this.androidPermissions.PERMISSION.LOCATION_HARDWARE,
        this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION,
        this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.FOREGROUND_SERVICE_MICROPHONE,
        this.androidPermissions.PERMISSION.READ_MEDIA_VIDEO,
        this.androidPermissions.PERMISSION.ACCEPT_HANDOVER,
      ])
    );

    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      // this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
      // this.androidPermissions.PERMISSION.ACCESS_MEDIA_LOCATION,
      // this.androidPermissions.PERMISSION.CONTROL_LOCATION_UPDATES,
      // this.androidPermissions.PERMISSION.INSTALL_LOCATION_PROVIDER,
      // this.androidPermissions.PERMISSION.LOCATION_HARDWARE,
      this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION,
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.FOREGROUND_SERVICE_MICROPHONE,
      this.androidPermissions.PERMISSION.READ_MEDIA_VIDEO,
      this.androidPermissions.PERMISSION.ACCEPT_HANDOVER,
    ]);
  }
}
