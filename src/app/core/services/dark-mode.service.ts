import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs';
import { MODE_STORAGE_NAME } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})

export class DarkModeService {
  // Для компоненти в якій буде перемикач
  // <ion-item>
  //   <ion-label>Dark Mode</ion-label>
  //   <ion-toggle color="tertiary" [formControl]="toggleDarkMode" slot="end" (ionChange)="changeThemeMode($event)"></ion-toggle>
  // </ion-item>

  // import { FormControl } from '@angular/forms';
  // import { DarkModeService } from 'src/app/core/services/dark-mode.services';
  // toggleDarkMode = new FormControl(false);
  // constructor(
  //   private mode: DarkModeService
  // ) {
  //   this.mode.getMode.subscribe((mode: boolean) => {
  //     this.toggleDarkMode.setValue(mode)
  //   })
  // }
  // changeThemeMode(event: any) {
  //   this.mode.changeThemeMode(event)
  // }
  public currentMode$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  get getMode() {
    return this.currentMode$;
  }

  constructor(
    private storage: Storage
  ) { }

  async getThemeMode() {
    const themeMode = await this.storage.get(MODE_STORAGE_NAME);
    if (themeMode) {
      this.setThemeMode(themeMode);
    } else {
      this.checkDeviceDefaultThemeMode();
    }
  }

  checkDeviceDefaultThemeMode() {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    this.setThemeMode(darkMode?.matches ? 'dark' : 'light');
    this.storage.set(MODE_STORAGE_NAME, darkMode?.matches ? 'dark' : 'light');
  }

  changeThemeMode(event: any) {
    this.setThemeMode(event?.detail?.checked ? 'dark' : 'light');
    this.storage.set(MODE_STORAGE_NAME, event?.detail?.checked ? 'dark' : 'light');
  };

  setThemeMode(mode: string) {
    if (mode === 'dark') {
      document.body.classList.add('dark-theme');
      this.currentMode$.next(true);
    } else {
      document.body.classList.remove('dark-theme');
      this.currentMode$.next(false);
    }
  }
}
