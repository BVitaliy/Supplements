import { Injectable, NgZone } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  CameraDirection,
} from '@capacitor/camera';
import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(
    private multipleDocumentsPicker: MultipleDocumentsPicker,
    public ngZone: NgZone
  ) {}

  // Зробити фото - Capacitor Camera
  takePhoto(direction?: keyof typeof CameraDirection): Promise<any> {
    const options = {
      quality: 100,
      allowEditing: false, // true
      resultType: CameraResultType.DataUrl,
      saveToGallery: true,
      // width: 300,
      // height: 300,
      source: CameraSource.Camera,
      direction: CameraDirection[direction || 'Rear'],
      // presentationStyle: 'fullscreen',
      promptLabelHeader: 'Choose one of the options', // 'Choose where you want to take the picture'
      promptLabelCancel: 'Cancel',
      promptLabelPhoto: 'Gallery',
      promptLabelPicture: 'Camera',
    };
    return Camera.getPhoto(options);
  }

  // Вибрати фото - Capacitor Camera
  choosePicture(quantity?: number): Promise<any> {
    // Capacitor Gallery
    if (quantity) {
      const options = {
        quality: 100,
        // width: 300,
        // height: 300,
        limit: quantity,
      };
      return Camera.pickImages(options);
    } else {
      const options = {
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        saveToGallery: true,
        // width: 300,
        // height: 300,
        source: CameraSource.Photos,
        direction: CameraDirection.Front,
        // presentationStyle: 'fullscreen',
        promptLabelHeader: 'Choose one of the options', // 'Choose where you want to take the picture'
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'Gallery',
        promptLabelPicture: 'Camera',
      };
      return Camera.getPhoto(options);
    }
  }

  // Вибір документів - Cordova MultipleDocumentsPicker
  chooseDocuments(): Promise<any> {
    return this.multipleDocumentsPicker.pick(2);
  }

  // Перетворення із base64 у blob
  async base64toBlob(dataURI: string): Promise<any> {
    let byteString: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  // Перетворення із blob у base64
  blobToBase64 = (blob: Blob) =>
    new Promise((resolve: any, reject: any) => {
      this.ngZone.run(() => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result) as string;
        };
        reader.readAsDataURL(blob);
      });
    });

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)
      .__zone_symbol__originalInstance;
    return zoneOriginalInstance || fileReader;
  }
}
