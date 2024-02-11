import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.page.html',
  styleUrls: ['./all-brands.page.scss'],
})
export class AllBrandsPage implements OnInit {
  loading: boolean = false;
  searchForm!: FormGroup;

  public brandList: any[] = [
    {
      label: '0-9',
      brands: [
        {
          label: 'Brand name',
          id: 1,
        },
        {
          label: 'Brand name',
          id: 2,
        },
        {
          label: 'Brand name',
          id: 3,
        },
        {
          label: 'Brand name',
          id: 4,
        },
      ],
    },
    {
      label: 'A',
      brands: [
        {
          label: 'Brand name',
          id: 1,
        },
        {
          label: 'Brand name',
          id: 2,
        },
        {
          label: 'Brand name',
          id: 3,
        },
        {
          label: 'Brand name',
          id: 4,
        },
      ],
    },
  ];

  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    });
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.searchForm.get('search')?.setValue(event?.detail?.value);
  }
}
