import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {emailPattern} from '../../core/validators/email.validator';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.page.html',
  styleUrls: ['./elements.page.scss'],
})
export class ElementsPage implements OnInit {
  form: FormGroup;
  selectInterfaceOptions = {
    cssClass: ''
  };
  popoverOptions: any = {
    cssClass: 'in-popover'
  };

  constructor() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    });
  }

  ngOnInit() {
  }

}
