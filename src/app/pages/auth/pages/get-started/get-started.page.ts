import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
})
export class GetStartedPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}
}
