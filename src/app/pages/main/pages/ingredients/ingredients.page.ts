import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss'],
})
export class IngredientsPage implements OnInit {
  loading: boolean = false;
  searchForm!: FormGroup;

  public brandList: any[] = [
    {
      label: 'A',
      brands: [
        {
          label: 'Aloe Vera',
          id: 1,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 2,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 3,
          color: '#22B51F',
        },
        {
          label: 'Aloe Vera',
          id: 4,
          color: '#22B51F',
        },
      ],
    },
    {
      label: 'B',
      brands: [
        {
          label: 'Basil',
          id: 1,
          color: '#22B51F',
        },
        {
          label: 'Beta - Glucans',
          id: 2,
          color: '#FF001C',
        },
        {
          label: 'Bilberry',
          id: 3,
          color: '#FDE334',
        },
        {
          label: 'Bilberry',
          id: 4,
          color: '#FDE334',
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
