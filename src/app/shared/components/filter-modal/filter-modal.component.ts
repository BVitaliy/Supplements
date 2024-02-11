import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Brands, Categories } from 'src/mock/filters';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() filters!: any;
  public form!: FormGroup;
  public categories: any[] = [...Categories];
  public brands: any[] = [...Brands];

  selectedOptions: any[] = [];
  backBtnSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    console.log(this.filters);
    this.form = new FormGroup({
      filters: new FormControl(this.filters || null),
    });
  }

  public async handleApplyChanges() {
    // apply changes
    // console.log(this.addedIngredientsOptions);
    await this.modalController.dismiss(null);
  }

  filtered($event: any) {
    console.log($event);
    // if (
    //   option &&
    //   this.addedOptions.every((el: any): boolean => el.id !== option.id)
    // ) {
    //   this.addedOptions.push(option);
    //   if (option.id) {
    //     this.handleChangeCheckboxState(true, option.id);
    //   }
    // } else if (
    //   option &&
    //   this.addedOptions.some((el: any): boolean => el.id === option.id)
    // ) {
    //   this.addedOptions = this.addedOptions.filter(
    //     (el: any): boolean => el.id !== option.id
    //   );
    //   if (option.id) {
    //     this.handleChangeCheckboxState(false, option.id);
    //   }
    // }
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
  }

  async cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    const onClosedData = this.form.value?.filters || null;
    await this.modalController.dismiss(onClosedData);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
