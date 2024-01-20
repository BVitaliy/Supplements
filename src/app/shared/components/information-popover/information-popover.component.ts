import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController, Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { onlyNumbers } from 'src/app/core/validators/email.validator';

@Component({
  selector: 'app-information-popover',
  templateUrl: './information-popover.component.html',
  styleUrls: ['./information-popover.component.scss'],
})
export class InformationPopoverComponent implements OnInit {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() text!: string;
  @Input() form!: boolean;
  @Input() buttons!: Array<any>;
  @Input() imgSrc!: string;
  @Input() closeEnable!: boolean;
  @Input() exit = false;
  backBtnSubscription!: Subscription;
  code!: FormControl;

  constructor(
    public navCtrl: NavController,
    private popoverController: PopoverController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.code = new FormControl(null, [Validators.required, Validators.minLength(4), Validators.pattern(onlyNumbers)]);
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(9997, () => {
      if (this.closeEnable) {
        this.closePopover();
      }
    });
  }

  async closePopover(body?: any) {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    await this.popoverController.dismiss(body);
  }

  redirectTo(button: any) {
    if (button?.route) {
      if (button?.route?.includes('itms-apps://itunes.apple.com/app/id') || button?.route?.includes('market://details?id=') || button?.route?.includes('http')) {
        window.open(button?.route, '_system');
      } else {
        this.navCtrl.navigateForward([button?.route]);
      }
    }
    this.closePopover(button?.role ? button?.role : null);
  }

  confirmOrder() {
    // тут має бути реквест на перевірку коду із СМС
    this.closePopover(this.code.value);
  }

  // resendOrderConfirmationCode() {
  //   console.log('new code was send to your device');
  // }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    };
  }
}
