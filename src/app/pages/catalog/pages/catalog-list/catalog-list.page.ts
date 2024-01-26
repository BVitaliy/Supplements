import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.page.html',
  styleUrls: ['./catalog-list.page.scss'],
})
export class CatalogListPage implements OnInit {
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
}
