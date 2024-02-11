import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SourcePopoverComponent } from 'src/app/shared/components/source-popover/source-popover.component';
import { ThankComponent } from 'src/app/shared/components/thank/thank.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  form!: FormGroup;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      photo: new FormControl(null, [Validators.required]),
      barcode: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      product: new FormControl(null, [Validators.required]),
      ingredients: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
    });
  }

  async createProduct() {
    this.form.reset();
    const modal = await this.modalController.create({
      component: ThankComponent,
      cssClass: 'full-screen-modal',
      mode: 'ios',
      componentProps: {
        title: 'Thank you!',
        description: `Your request is under review <br/> We will let you know if the product you submitted has been added to the database`,
        buttonRouterUrl: '/home/tabs/tab/catalog',
        imgSrc: './assets/img/thank-img.svg',
        hasCloseBtn: false,
        buttonText: 'Done',
      },
    });
    return await modal.present();
  }

  // Відкривання модалки ingredient detail
  async openSourcePopover() {
    const modalHeight =
      Math.floor(
        (100 * (210 + (this.platform.is('ios') ? 34 : 0))) / window.innerHeight
      ) / 100;

    const modal = await this.modalController.create({
      component: SourcePopoverComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, modalHeight],
      initialBreakpoint: modalHeight,
      handle: true,
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        this.form.get('photo')?.setValue(returnedData?.data);
        console.log(returnedData);
      }
    });

    return await modal.present();
  }
}
