import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { IonFooter, IonSlides, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-zooming',
  templateUrl: './image-zooming.component.html',
  styleUrls: ['./image-zooming.component.scss'],
})
export class ImageZoomingComponent implements OnInit {
  @ViewChild(IonSlides) slides!: IonSlides;
  @ViewChild('img') img!: ElementRef;
  @Input('image') image: any;

  sliderOpts = {
    // zoom: true
  };
  backBtnSubscription!: Subscription;

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.img.nativeElement.contains(event.target)) {
      this.cancelModal();
    }
  }

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(9995, () => {
      this.cancelModal();
    });
  }

  ionViewDidEnter() {
    this.slides.update();
  }

  async zoom(zoomIn: boolean) {
    const slider = await this.slides.getSwiper();
    const zoom = slider.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    this.modalController?.dismiss();
  }

}
