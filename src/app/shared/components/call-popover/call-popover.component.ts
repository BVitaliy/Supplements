import { Component, Input, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-call-popover',
  templateUrl: './call-popover.component.html',
  styleUrls: ['./call-popover.component.scss'],
})
export class CallPopoverComponent implements OnInit {
  @Input() title!: string;
  @Input() message!: string;
  backBtnSubscription!: Subscription;

  constructor(
    private popoverController: PopoverController,
    private platform: Platform
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(9997, () => {
      this.closePopover();
    });
  }

  async closePopover(body?: any) {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    await this.popoverController.dismiss(body);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    };
  }
}
