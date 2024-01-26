import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.page.html',
  styleUrls: ['./catalog-detail.page.scss'],
})
export class CatalogDetailPage implements OnInit {
  public listProducts: any[] = [...Products];
  loading: boolean = false;
  filterForm!: FormGroup;
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl(null),
    });
  }

  search(event: any) {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
  }

  openSortPopover() {}

  openFilter() {}
}
