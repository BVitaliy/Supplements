import { Injectable } from '@angular/core';
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
  constructor(private multipleDocumentsPicker: MultipleDocumentsPicker) {}

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

    // // CORDOVA Camera
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   sourceType: this.camera.PictureSourceType.CAMERA, // PHOTOLIBRARY CAMERA SAVEDPHOTOALBUM
    //   allowEdit: true,
    //   encodingType: this.camera.EncodingType.JPEG, // JPEG PNG
    //   targetWidth: 300,
    //   targetHeight: 300,
    //   mediaType: this.camera.MediaType.ALLMEDIA, // not work. Work if sourceType = PHOTOLIBRARY or SAVEDPHOTOALBUM
    //   correctOrientation: false,
    //   saveToPhotoAlbum: true,
    //   cameraDirection: this.camera.Direction.FRONT, // BACK
    // };
    // return this.camera.getPicture(options);
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

    // // Cordova Gallery
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, // PHOTOLIBRARY CAMERA SAVEDPHOTOALBUM
    //   allowEdit: true,
    //   encodingType: this.camera.EncodingType.JPEG, // JPEG PNG
    //   targetWidth: 300,
    //   targetHeight: 300,
    //   mediaType: this.camera.MediaType.PICTURE, // PICTURE VIDEO ALLMEDIA. NOT work. Work if sourceType = PHOTOLIBRARY or SAVEDPHOTOALBUM
    //   correctOrientation: false,
    //   saveToPhotoAlbum: true,
    //   cameraDirection: this.camera.Direction.FRONT, // BACK
    // };
    // return this.camera.getPicture(options);

    // // Cordova ImagePicker
    // const maximumImagesCount = 1;
    // const options: ImagePickerOptions = {
    //   maximumImagesCount,
    //   quality: 100,
    //   outputType: 1,
    // };
    // return this.imagePicker.getPictures(options);
  }

  // Вибір документів - Cordova MultipleDocumentsPicker
  chooseDocuments(): Promise<any> {
    return this.multipleDocumentsPicker.pick(2);
  }

  // Перетворення із base64 у blob
  base64toBlob(dataURI: string) {
    console.log(dataURI);
    console.log(dataURI.split(','));
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
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result) as string;
      };
      reader.readAsDataURL(blob);
    });
}
