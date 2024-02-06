import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredient-detail-modal',
  templateUrl: './ingredient-detail-modal.component.html',
  styleUrls: ['./ingredient-detail-modal.component.scss'],
})
export class IngredientDetailModalComponent implements OnInit {
  @Input() title = '';
  @Input() color = '';
  @Input() indregientDetail: any;
  backBtnSubscription!: Subscription;
  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.title);
  }
}
