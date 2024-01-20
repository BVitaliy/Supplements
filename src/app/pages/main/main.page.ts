import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonInfiniteScroll,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs';
import { OrderService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: {
    disabled: boolean;
    complete: () => any;
  };
  loading: boolean = false;
  filterForm!: FormGroup;

  statuses!: any;
  selectedStatus: any;
  disableInfinity = false;

  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    // this.getOrders();
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    // this.getOrders(true, () => event.target.complete());
  }

  // Пошук
  search(event: any) {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
    // this.getOrders(true);
  }

  // Підгрузка результатів
  // loadData() {
  //   if (!this.disableInfinity) {
  //     setTimeout(() => {
  //       this.filterForm.get('current_page')?.setValue(1);
  //       this.filterForm
  //         .get('items_per_page')
  //         ?.setValue(this.filterForm.get('items_per_page')?.value + 10);
  //       this.getOrders(true);
  //     }, 500);
  //   } else {
  //     this.disableInfinity = true;
  //   }
  // }
}
