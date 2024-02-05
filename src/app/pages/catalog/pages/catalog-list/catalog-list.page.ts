import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.page.html',
  styleUrls: ['./catalog-list.page.scss'],
})
export class CatalogListPage implements OnInit {
  public loading: boolean = false;
  public filterForm!: FormGroup;
  public isSearchActive: boolean = false;

  constructor(public navCtrl: NavController) {}

  public ngOnInit(): void {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
  }

  public onSearchFocus(_event: any): void {
    this.isSearchActive = true;
  }

  public handleCancelSearch(): void {
    this.isSearchActive = false;
  }
}
