import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  profile: any;
  constructor() {}

  ngOnInit() {
    this.profile = {
      photo: './assets/img/temp/photo.png' || '',
      name: 'Anna Armas' || '',
      email: 'annaarmas@email.com' || '',
    };
  }
}
