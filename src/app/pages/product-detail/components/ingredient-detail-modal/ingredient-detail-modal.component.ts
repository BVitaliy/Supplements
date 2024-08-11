import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { getPriorityValue } from 'src/app/core/functions/priority-value';

@Component({
  selector: 'app-ingredient-detail-modal',
  templateUrl: './ingredient-detail-modal.component.html',
  styleUrls: ['./ingredient-detail-modal.component.scss'],
})
export class IngredientDetailModalComponent implements OnInit {
  @Input() item: any;
  backBtnSubscription!: Subscription;
  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.item);
  }

  getPriorityValue(data: any) {
    return getPriorityValue(data);
  }
}
