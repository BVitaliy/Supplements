import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SourcePopoverComponent } from 'src/app/shared/components/source-popover/source-popover.component';
import { ThankComponent } from 'src/app/shared/components/thank/thank.component';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from 'src/app/core/services/photo.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { createWorker } from 'tesseract.js';
import { finalize, Subscription } from 'rxjs';
import { CatalogService } from '../catalog/catalog.service';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  @Input() id: any = null;
  form!: FormGroup;
  image: any;
  type: any;
  isLoading = false;
  backBtnSubscription!: Subscription;
  format: any;

  imageLoading = false;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform,
    private photoService: PhotoService,
    private alertService: AlertService,
    private catalogService: CatalogService,
    private themeOptions: ThemeOptionsService,
    private barcodeScanner: BarcodeScanner,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      photo: new FormControl(null, [Validators.required]),
      images: new FormControl([]),
      id: new FormControl(null),
      barcode: new FormControl(null, [Validators.required]),
      status: new FormControl(0),
      brand: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      ingredients: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      decline_reason: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarWhite();
    }
    if (this.id) {
      this.getProduct();
    }
    // this.getData();
  }

  async createProductSuccess(url?: string) {
    this.form.reset();
    const modal = await this.modalController.create({
      component: ThankComponent,
      cssClass: 'full-screen-modal',
      mode: 'ios',
      componentProps: {
        title: 'Thank you!',
        description: `Your request is under review <br/> We will let you know if the product you submitted has been added to the database`,
        buttonRouterUrl: url,
        // imgSrc: './assets/img/thank-img.svg',
        hasCloseBtn: false,
        buttonText: 'Done',
        svg: `<svg width="200" height="199" viewBox="0 0 200 199" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M199.111 99.5C199.111 112.005 182.441 121.075 177.965 131.959C173.296 143.229 178.467 161.369 169.977 169.86C161.488 178.351 143.313 173.179 132.083 177.85C121.24 182.365 112.133 199 99.6306 199C87.128 199 78.0597 182.327 67.1778 177.85C55.91 173.179 37.7735 178.351 29.2841 169.86C20.7947 161.369 26.0041 143.19 21.2963 131.959C16.7815 121.114 0.111328 112.005 0.111328 99.5C0.111328 86.995 16.7815 77.9249 21.2963 67.0409C25.9655 55.7709 20.7947 37.6309 29.2841 29.1398C37.7735 20.6488 55.9486 25.8206 67.1778 21.1505C78.0212 16.6348 87.128 0 99.6306 0C112.133 0 121.201 16.6734 132.083 21.1505C143.351 25.8206 161.488 20.6488 169.977 29.1398C178.467 37.6309 173.296 55.8095 177.965 67.0409C182.48 77.8863 199.111 86.995 199.111 99.5Z" fill="#FFCCA7"/>
<path d="M85.6045 75.1283C86.0593 75.932 86.5667 76.7007 87.1089 77.4345C87.6512 78.1683 88.246 78.8671 88.8758 79.531C89.5055 80.1949 90.1878 80.8239 90.8875 81.4004C91.5872 81.9769 92.3395 82.5185 93.1267 83.0077C93.9139 83.4969 94.7186 83.9512 95.5582 84.3355C96.3979 84.7374 97.2726 85.0693 98.1822 85.3663C97.2901 85.6633 96.4154 85.9953 95.5582 86.3971C94.7186 86.799 93.8964 87.2357 93.1267 87.7249C92.3395 88.2141 91.6047 88.7557 90.8875 89.3323C90.1703 89.9088 89.5055 90.5378 88.8758 91.2017C88.246 91.8656 87.6512 92.5644 87.1089 93.2982C86.5667 94.032 86.0593 94.8007 85.6045 95.6044C85.1497 96.408 84.7473 97.2466 84.3975 98.1027C84.0476 98.9588 83.7502 99.8498 83.4878 100.758L83.4178 101.003L83.3479 101.248L83.2779 101.492L83.2079 101.737L83.138 101.981L83.068 102.226L82.998 102.47L82.928 102.715L82.8581 102.47L82.7881 102.226L82.7181 101.981L82.6481 101.737L82.5782 101.492L82.5082 101.248L82.4382 101.003L82.3682 100.758C82.1233 99.8498 81.826 98.9588 81.4586 98.1027C81.1087 97.2466 80.7064 96.408 80.2516 95.6044C79.7967 94.8007 79.2894 94.032 78.7471 93.2982C78.2048 92.5644 77.6101 91.8656 76.9803 91.2017C76.3505 90.5378 75.6683 89.9088 74.9686 89.3323C74.2513 88.7557 73.5166 88.2141 72.7294 87.7249C71.9422 87.2357 71.1375 86.7815 70.2978 86.3971C69.4582 85.9953 68.5835 85.6633 67.6738 85.3663C68.566 85.0693 69.4407 84.7374 70.2978 84.3355C71.1375 83.9337 71.9597 83.4969 72.7294 83.0077C73.4991 82.5185 74.2513 81.9769 74.9686 81.4004C75.6858 80.8239 76.3505 80.1949 76.9803 79.531C77.6101 78.8671 78.2048 78.1683 78.7471 77.4345C79.2894 76.7007 79.7967 75.932 80.2516 75.1283C80.7064 74.3246 81.1087 73.486 81.4586 72.6299C81.8085 71.7739 82.1058 70.8828 82.3682 69.9743L82.4382 69.7297L82.5082 69.4851L82.5782 69.2406L82.6481 68.996L82.7181 68.7514L82.7881 68.5068L82.8581 68.2622L82.928 68.0176L82.998 68.2622L83.068 68.5068L83.138 68.7514L83.2079 68.996L83.2779 69.2406L83.3479 69.4851L83.4178 69.7297L83.4878 69.9743C83.7327 70.8828 84.0301 71.7739 84.3975 72.6299C84.7473 73.486 85.1497 74.3246 85.6045 75.1283Z" fill="#FFCCA7" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<path d="M166.128 119.981C166.583 120.784 167.09 121.553 167.632 122.287C168.175 123.021 168.769 123.72 169.399 124.384C170.029 125.047 170.711 125.676 171.411 126.253C172.111 126.829 172.863 127.371 173.65 127.86C174.437 128.349 175.242 128.804 176.082 129.188C176.921 129.59 177.796 129.922 178.706 130.219C177.814 130.516 176.939 130.848 176.082 131.25C175.242 131.651 174.42 132.088 173.65 132.577C172.863 133.067 172.128 133.608 171.411 134.185C170.694 134.761 170.029 135.39 169.399 136.054C168.769 136.718 168.175 137.417 167.632 138.151C167.09 138.885 166.583 139.653 166.128 140.457C165.673 141.261 165.271 142.099 164.921 142.955C164.571 143.811 164.274 144.702 164.011 145.611L163.941 145.855L163.871 146.1L163.801 146.345L163.731 146.589L163.661 146.834L163.591 147.078L163.521 147.323L163.451 147.568L163.381 147.323L163.312 147.078L163.242 146.834L163.172 146.589L163.102 146.345L163.032 146.1L162.962 145.855L162.892 145.611C162.647 144.702 162.349 143.811 161.982 142.955C161.632 142.099 161.23 141.261 160.775 140.457C160.32 139.653 159.813 138.885 159.271 138.151C158.728 137.417 158.133 136.718 157.504 136.054C156.874 135.39 156.192 134.761 155.492 134.185C154.775 133.608 154.04 133.067 153.253 132.577C152.466 132.088 151.661 131.634 150.821 131.25C149.982 130.848 149.107 130.516 148.197 130.219C149.089 129.922 149.964 129.59 150.821 129.188C151.661 128.786 152.483 128.349 153.253 127.86C154.023 127.371 154.775 126.829 155.492 126.253C156.209 125.676 156.874 125.047 157.504 124.384C158.133 123.72 158.728 123.021 159.271 122.287C159.813 121.553 160.32 120.784 160.775 119.981C161.23 119.177 161.632 118.339 161.982 117.482C162.332 116.626 162.629 115.735 162.892 114.827L162.962 114.582L163.032 114.338L163.102 114.093L163.172 113.848L163.242 113.604L163.312 113.359L163.381 113.115L163.451 112.87L163.521 113.115L163.591 113.359L163.661 113.604L163.731 113.848L163.801 114.093L163.871 114.338L163.941 114.582L164.011 114.827C164.256 115.735 164.554 116.626 164.921 117.482C165.271 118.339 165.673 119.177 166.128 119.981Z" fill="#FF7A00" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<path d="M173.719 26.419C173.979 26.879 174.27 27.319 174.58 27.7391C174.891 28.1591 175.231 28.5591 175.592 28.9391C175.952 29.3192 176.343 29.6792 176.743 30.0092C177.144 30.3393 177.574 30.6493 178.025 30.9293C178.475 31.2093 178.936 31.4693 179.417 31.6894C179.897 31.9194 180.398 32.1094 180.919 32.2794C180.408 32.4494 179.907 32.6394 179.417 32.8695C178.936 33.0995 178.465 33.3495 178.025 33.6295C177.574 33.9095 177.154 34.2196 176.743 34.5496C176.333 34.8796 175.952 35.2396 175.592 35.6197C175.231 35.9997 174.891 36.3997 174.58 36.8198C174.27 37.2398 173.979 37.6798 173.719 38.1399C173.459 38.5999 173.228 39.0799 173.028 39.57C172.828 40.06 172.658 40.5701 172.507 41.0901L172.467 41.2301L172.427 41.3701L172.387 41.5101L172.347 41.6501L172.307 41.7902L172.267 41.9302L172.227 42.0702L172.187 42.2102L172.147 42.0702L172.107 41.9302L172.067 41.7902L172.027 41.6501L171.987 41.5101L171.947 41.3701L171.907 41.2301L171.866 41.0901C171.726 40.5701 171.556 40.06 171.346 39.57C171.145 39.0799 170.915 38.5999 170.655 38.1399C170.394 37.6798 170.104 37.2398 169.794 36.8198C169.483 36.3997 169.143 35.9997 168.782 35.6197C168.422 35.2396 168.031 34.8796 167.631 34.5496C167.22 34.2196 166.8 33.9095 166.349 33.6295C165.898 33.3495 165.438 33.0895 164.957 32.8695C164.476 32.6394 163.976 32.4494 163.455 32.2794C163.966 32.1094 164.466 31.9194 164.957 31.6894C165.438 31.4593 165.908 31.2093 166.349 30.9293C166.79 30.6493 167.22 30.3393 167.631 30.0092C168.041 29.6792 168.422 29.3192 168.782 28.9391C169.143 28.5591 169.483 28.1591 169.794 27.7391C170.104 27.319 170.394 26.879 170.655 26.419C170.915 25.9589 171.145 25.4789 171.346 24.9888C171.546 24.4988 171.716 23.9888 171.866 23.4687L171.907 23.3287L171.947 23.1887L171.987 23.0487L172.027 22.9087L172.067 22.7687L172.107 22.6287L172.147 22.4886L172.187 22.3486L172.227 22.4886L172.267 22.6287L172.307 22.7687L172.347 22.9087L172.387 23.0487L172.427 23.1887L172.467 23.3287L172.507 23.4687C172.648 23.9888 172.818 24.4988 173.028 24.9888C173.228 25.4789 173.459 25.9589 173.719 26.419Z" fill="white" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<path d="M108.438 62.1572C108.698 62.6173 108.988 63.0573 109.299 63.4773C109.609 63.8974 109.95 64.2974 110.31 64.6774C110.671 65.0575 111.061 65.4175 111.462 65.7475C111.862 66.0775 112.293 66.3876 112.744 66.6676C113.194 66.9476 113.655 67.2076 114.135 67.4276C114.616 67.6577 115.117 67.8477 115.637 68.0177C115.127 68.1877 114.626 68.3777 114.135 68.6077C113.655 68.8378 113.184 69.0878 112.744 69.3678C112.293 69.6478 111.872 69.9578 111.462 70.2879C111.051 70.6179 110.671 70.9779 110.31 71.358C109.95 71.738 109.609 72.138 109.299 72.558C108.988 72.9781 108.698 73.4181 108.438 73.8782C108.177 74.3382 107.947 74.8182 107.747 75.3083C107.547 75.7983 107.376 76.3083 107.226 76.8284L107.186 76.9684L107.146 77.1084L107.106 77.2484L107.066 77.3884L107.026 77.5284L106.986 77.6684L106.946 77.8085L106.906 77.9485L106.866 77.8085L106.826 77.6684L106.785 77.5284L106.745 77.3884L106.705 77.2484L106.665 77.1084L106.625 76.9684L106.585 76.8284C106.445 76.3083 106.275 75.7983 106.065 75.3083C105.864 74.8182 105.634 74.3382 105.374 73.8782C105.113 73.4181 104.823 72.9781 104.512 72.558C104.202 72.138 103.862 71.738 103.501 71.358C103.141 70.9779 102.75 70.6179 102.349 70.2879C101.939 69.9578 101.518 69.6478 101.068 69.3678C100.617 69.0878 100.157 68.8278 99.6759 68.6077C99.1952 68.3777 98.6945 68.1877 98.1738 68.0177C98.6845 67.8477 99.1852 67.6577 99.6759 67.4276C100.157 67.1976 100.627 66.9476 101.068 66.6676C101.508 66.3876 101.939 66.0775 102.349 65.7475C102.76 65.4175 103.141 65.0575 103.501 64.6774C103.862 64.2974 104.202 63.8974 104.512 63.4773C104.823 63.0573 105.113 62.6173 105.374 62.1572C105.634 61.6972 105.864 61.2172 106.065 60.7271C106.265 60.2371 106.435 59.727 106.585 59.207L106.625 59.067L106.665 58.927L106.705 58.787L106.745 58.647L106.785 58.5069L106.826 58.3669L106.866 58.2269L106.906 58.0869L106.946 58.2269L106.986 58.3669L107.026 58.5069L107.066 58.647L107.106 58.787L107.146 58.927L107.186 59.067L107.226 59.207C107.366 59.727 107.537 60.2371 107.747 60.7271C107.947 61.2172 108.177 61.6972 108.438 62.1572Z" fill="white" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<path d="M137.774 137.345C138.034 137.805 138.324 138.245 138.635 138.665C138.945 139.085 139.286 139.485 139.646 139.865C140.007 140.245 140.397 140.605 140.798 140.935C141.198 141.265 141.629 141.575 142.079 141.855C142.53 142.135 142.991 142.395 143.471 142.615C143.952 142.845 144.453 143.035 144.973 143.205C144.463 143.375 143.962 143.565 143.471 143.795C142.991 144.025 142.52 144.275 142.079 144.555C141.629 144.835 141.208 145.145 140.798 145.475C140.387 145.805 140.007 146.165 139.646 146.545C139.286 146.925 138.945 147.326 138.635 147.746C138.324 148.166 138.034 148.606 137.774 149.066C137.513 149.526 137.283 150.006 137.083 150.496C136.882 150.986 136.712 151.496 136.562 152.016L136.522 152.156L136.482 152.296L136.442 152.436L136.402 152.576L136.362 152.716L136.322 152.856L136.282 152.996L136.242 153.136L136.202 152.996L136.161 152.856L136.121 152.716L136.081 152.576L136.041 152.436L136.001 152.296L135.961 152.156L135.921 152.016C135.781 151.496 135.611 150.986 135.4 150.496C135.2 150.006 134.97 149.526 134.71 149.066C134.449 148.606 134.159 148.166 133.848 147.746C133.538 147.326 133.197 146.925 132.837 146.545C132.476 146.165 132.086 145.805 131.685 145.475C131.275 145.145 130.854 144.835 130.404 144.555C129.953 144.275 129.492 144.015 129.012 143.795C128.531 143.565 128.03 143.375 127.51 143.205C128.02 143.035 128.521 142.845 129.012 142.615C129.492 142.385 129.963 142.135 130.404 141.855C130.844 141.575 131.275 141.265 131.685 140.935C132.096 140.605 132.476 140.245 132.837 139.865C133.197 139.485 133.538 139.085 133.848 138.665C134.159 138.245 134.449 137.805 134.71 137.345C134.97 136.885 135.2 136.405 135.4 135.915C135.601 135.425 135.771 134.915 135.921 134.395L135.961 134.254L136.001 134.114L136.041 133.974L136.081 133.834L136.121 133.694L136.161 133.554L136.202 133.414L136.242 133.274L136.282 133.414L136.322 133.554L136.362 133.694L136.402 133.834L136.442 133.974L136.482 134.114L136.522 134.254L136.562 134.395C136.702 134.915 136.872 135.425 137.083 135.915C137.283 136.405 137.513 136.885 137.774 137.345Z" fill="white" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<path d="M145.433 12.1107C145.887 12.9144 146.395 13.6831 146.937 14.4169C147.479 15.1507 148.074 15.8495 148.704 16.5134C149.334 17.1773 150.016 17.8063 150.716 18.3828C151.415 18.9594 152.168 19.501 152.955 19.9902C153.742 20.4793 154.547 20.9336 155.386 21.318C156.226 21.7198 157.101 22.0517 158.01 22.3487C157.118 22.6458 156.244 22.9777 155.386 23.3795C154.547 23.7814 153.724 24.2181 152.955 24.7073C152.168 25.1965 151.433 25.7381 150.716 26.3147C149.998 26.8912 149.334 27.5202 148.704 28.1841C148.074 28.848 147.479 29.5468 146.937 30.2806C146.395 31.0144 145.887 31.7831 145.433 32.5868C144.978 33.3904 144.575 34.2291 144.226 35.0851C143.876 35.9412 143.578 36.8322 143.316 37.7407L143.246 37.9853L143.176 38.2299L143.106 38.4745L143.036 38.7191L142.966 38.9637L142.896 39.2083L142.826 39.4529L142.756 39.6975L142.686 39.4529L142.616 39.2083L142.546 38.9637L142.476 38.7191L142.406 38.4745L142.336 38.2299L142.266 37.9853L142.196 37.7407C141.951 36.8322 141.654 35.9412 141.287 35.0851C140.937 34.2291 140.535 33.3904 140.08 32.5868C139.625 31.7831 139.118 31.0144 138.575 30.2806C138.033 29.5468 137.438 28.848 136.808 28.1841C136.179 27.5202 135.496 26.8912 134.797 26.3147C134.079 25.7381 133.345 25.1965 132.558 24.7073C131.77 24.2181 130.966 23.7639 130.126 23.3795C129.286 22.9777 128.412 22.6458 127.502 22.3487C128.394 22.0517 129.269 21.7198 130.126 21.318C130.966 20.9161 131.788 20.4793 132.558 19.9902C133.327 19.501 134.079 18.9594 134.797 18.3828C135.514 17.8063 136.179 17.1773 136.808 16.5134C137.438 15.8495 138.033 15.1507 138.575 14.4169C139.118 13.6831 139.625 12.9144 140.08 12.1107C140.535 11.307 140.937 10.4684 141.287 9.61236C141.637 8.75627 141.934 7.86525 142.196 6.95676L142.266 6.71216L142.336 6.46757L142.406 6.22297L142.476 5.97838L142.546 5.73378L142.616 5.48919L142.686 5.24459L142.756 5L142.826 5.24459L142.896 5.48919L142.966 5.73378L143.036 5.97838L143.106 6.22297L143.176 6.46757L143.246 6.71216L143.316 6.95676C143.561 7.86525 143.858 8.75627 144.226 9.61236C144.575 10.4684 144.978 11.307 145.433 12.1107Z" fill="#FF4D00" stroke="#04002C" stroke-width="2" stroke-linejoin="round"/>
<rect x="2.73292" y="167.594" width="216.375" height="14.2188" rx="7.10938" transform="rotate(-32.0789 2.73292 167.594)" fill="#FF4C00" stroke="black" stroke-width="2"/>
<rect x="144.971" y="79.6211" width="48.1328" height="12.2188" rx="6.10938" transform="rotate(-32.0789 144.971 79.6211)" fill="white"/>
</svg>`,
      },
    });

    modal.onDidDismiss().then(() => {
      setTimeout(() => {
        this.themeOptions.refreshPage$.next(true);
      }, 600);
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
        this.form.get('photo')?.setValue(returnedData?.data?.photo);
        if (returnedData?.data?.photo?.name) {
          // this.image = this.photoService.blobToBase64(
          //   returnedData?.data?.photo
          // );
          const reader = this.photoService.getFileReader();
          console.log(reader);
          this.photoService.ngZone.run(() => {
            reader.readAsDataURL(returnedData?.data?.photo);
            reader.onloadend = (e: any) => {
              this.image = e.target?.result;
              this.changeDetectorRef.detectChanges();
              setTimeout(() => {
                this.changeDetectorRef.detectChanges();
              }, 300);
            };
          });
        }
        this.format = returnedData?.data?.format;
      }
    });

    return await modal.present();
  }

  async takeTextFromImage(input: string) {
    // const photo = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: true,
    //   resultType: CameraResultType.Uri,
    //   source: CameraSource.Camera,
    // });

    this.photoService.takePhoto().then(
      async (imageData: any) => {
        if (imageData) {
          // const photo = imageData.dataUrl;
          // let blob = this.photoService.base64toBlob(imageData?.dataUrl);
          // const photo64 = this.photoService.blobToBase64(blob);
          // const fd = new FormData();
          // fd.append('file', blob, 'filename.jpg');

          console.log(imageData?.dataUrl);
          const image = imageData?.dataUrl;
          const worker = await createWorker();
          if (worker) {
            this.isLoading = true;
            this.type = input;
          }
          worker.load();
          const {
            data: { text },
          } = await worker.recognize(image);
          console.log(text);
          if (text) {
            this.form.get(input)?.setValue(text);
            this.isLoading = false;
            this.type = null;
          }
          await worker.terminate();
        } else {
          // this.loadingPhoto = false;
          this.alertService.warning('Something went wrong, please try again');
        }
      },
      (error: any) => {
        // this.loadingPhoto = false;
      }
    );
    // this.image = photo.webPath;
    // console.log(photo);
  }

  async cancelModal() {
    if (this.id) {
      if (this.backBtnSubscription) {
        this.backBtnSubscription.unsubscribe();
      }
      const onClosedData = this.form.value || null;
      await this.modalController.dismiss(onClosedData);
    } else {
      // this.navCtrl.back();
      this.navCtrl.navigateBack(['home/tabs/tab/main']);
    }
  }

  goToMainPage() {}

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  requestProduct() {
    this.isLoading = true;
    let data = {
      ...this.form.value,
      status: 0,
    };
    console.log(this.form.value.photo);
    if (
      this.form.value.photo &&
      !this.form.value.photo?.name &&
      this.form.value.photo.includes('svg+xml')
    ) {
      this.format = 'svg';
    }
    delete data?.photo;
    delete data?.images;

    if (!this.id) {
      this.catalogService.requestSupplement(data).subscribe(
        (data: any) => {
          console.log(data);
          this.uploadImage(data?.id);
          this.isLoading = false;
          this.createProductSuccess('/home/tabs/tab/more/submitted-products');
        },
        (error: any) => {
          this.isLoading = false;
        }
      );
    } else {
      data = { ...data, status: 0 };
      this.catalogService.updateRequestSupplement(data).subscribe(
        (data: any) => {
          if (this.format) {
            this.uploadImage(data?.id);
          }
          this.isLoading = false;
          setTimeout(() => {
            this.alertService.createToast({
              header: 'Product was successfully updated!',
              mode: 'ios',
              position: 'bottom',
            });
            this.themeOptions.refreshPage$.next(true);
          }, 300);
          this.cancelModal();
          // this.createProductSuccess();
        },
        (error: any) => {
          this.isLoading = false;
        }
      );
    }
  }

  uploadImage(id: any) {
    const image = this.form.value.photo;
    console.log(image);

    if (image) {
      let blob: any;
      if (image?.name) {
        blob = image;
      } else {
        blob = this.photoService.base64toBlob(image);
      }

      const formData = new FormData();
      formData.append('images', blob, 'image.' + this.format);
      console.log(blob);
      console.log(formData);
      this.catalogService.uploadImage(id, formData).subscribe(
        (data: any) => {
          console.log(data);
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
        }
      );
    }
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getProduct(true, () => event.target.complete());
  }

  getProduct(refresh?: boolean, callbackFunction?: () => void) {
    this.isLoading = true;
    this.catalogService
      .getProductRequest(this.id, refresh)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.form.patchValue(data);
            if (data?.images?.length) {
              this.form.get('photo')?.setValue(data?.images[0]?.image);
            }
          }
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  scanBarcode() {
    if (this.platform.is('hybrid')) {
      this.isLoading = true;
      this.type = 'barcode';
      const options: BarcodeScannerOptions = {
        preferFrontCamera: false,
        showFlipCameraButton: true,
        showTorchButton: true,
        disableAnimations: false,
        disableSuccessBeep: false,
        // formats: 'QR_CODE',
        prompt: 'Place a barcode inside the scan areas',
        torchOn: false,
      };

      this.barcodeScanner
        .scan(options)
        .then((barcodeData) => {
          console.log(barcodeData);
          this.form.get('barcode')?.setValue(barcodeData?.text);
          this.isLoading = false;
          this.type = null;
        })
        .catch((error) => {
          this.isLoading = false;
          this.type = null;
        });
    }
  }
}
