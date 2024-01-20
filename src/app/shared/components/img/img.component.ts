import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageZoomingComponent } from '../image-zooming/image-zooming.component';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss'],
})
export class ImgComponent implements OnInit {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() cssClasses!: string;
  @Input() zooming = false;
  imgLoaded = false;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  imgDidLoad() {
    this.imgLoaded = true;
    // setTimeout(() => {
    //   this.imgLoaded = true;
    // }, 400);
  }

  async openPreview(image: any) {
    if (this.zooming) {
      const modal = await this.modalController.create({
        component: ImageZoomingComponent,
        cssClass: 'transparent-modal',
        mode: 'md',
        componentProps: {
          image
        }
      });
      modal.present();
    }
  }
}
