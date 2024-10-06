import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
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
  @Input() showSpinner = true;
  @Output() imgLoadedState: EventEmitter<boolean> = new EventEmitter<boolean>();
  imgLoaded = false;

  constructor(private modalController: ModalController, private zone: NgZone) {}

  ngOnInit() {}

  imgDidLoad() {
    this.zone.run(() => {
      this.imgLoaded = true;
      this.imgLoadedState.next(true);
    });
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
          image,
        },
      });
      modal.present();
    }
  }
}
