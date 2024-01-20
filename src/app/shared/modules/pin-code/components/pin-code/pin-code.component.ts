import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Config } from '../../interface/config';
import { KeysPipe } from '../../pipes/keys.pipe';

@Component({
  selector: 'app-pin-code',
  templateUrl: './pin-code.component.html',
  styleUrls: ['./pin-code.component.scss'],
})
export class PinCodeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() reset!: boolean;
  @Input() config!: Config;
  @Output() onInputChange: EventEmitter<string> = new EventEmitter<string>();
  length: number = 4;

  otpForm!: FormGroup;
  inputControls: FormControl[] = new Array(this.length);
  componentKey =
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
  currentInputId = `otp_0_${this.componentKey}`;

  formControl!: FormControl;
  constructor(private keysPipe: KeysPipe) {}

  ngOnInit() {
    this.otpForm = new FormGroup({});
    for (let index = 0; index < this.length; index++) {
      this.otpForm.addControl(this.getControlName(index), new FormControl());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reset ? this.remove() : null;
    this.reset = false;
  }

  ngAfterViewInit(): void {
    const containerItem = document.getElementById(`c_${this.componentKey}`);
    if (containerItem) {
      containerItem.addEventListener('paste', (evt) => this.handlePaste(evt));
      if (!this.config.disableAutoFocus) {
        const ele: any = containerItem.getElementsByClassName('otp-input')[0];
        if (ele && ele.focus) {
          ele.focus();
        }
      }
    }
  }

  remove() {
    this.otpForm.reset();
    this.currentInputId = this.appendKey(`otp_0`);
    this.setSelected(this.appendKey(`otp_0`));
    this.rebuildValue();
  }

  defaultFocus() {
    this.config!.inputStyles!['borderColor'] = 'var(--ion-color-tertiary)';
    this.setSelected(this.currentInputId);
  }

  private getControlName(idx: any) {
    return `ctrl_${idx}`;
  }

  ifLeftArrow(event: any) {
    return this.ifKeyCode(event, 37);
  }

  ifRightArrow(event: any) {
    return this.ifKeyCode(event, 39);
  }

  ifBackspaceOrDelete(event: any) {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      this.ifKeyCode(event, 8) ||
      this.ifKeyCode(event, 46)
    );
  }

  ifKeyCode(event: any, targetCode: any) {
    const key = event.keyCode || event.charCode;
    // tslint:disable-next-line: triple-equals
    return key == targetCode ? true : false;
  }

  onKeyDown($event: any): any {
    if (!$event.target.value) {
      this.focusTo;
    }
    var isSpace = this.ifKeyCode($event, 32);
    if (isSpace) {
      // prevent space
      return false;
    }
  }

  onKeyUp($event: any, inputIdx: any) {
    const nextInputId = this.appendKey(`otp_${inputIdx + 1}`);
    const prevInputId = this.appendKey(`otp_${inputIdx - 1}`);
    // if (this.ifRightArrow($event)) {
    //   this.setSelected(nextInputId);
    //   return;
    // }
    // if (this.ifLeftArrow($event)) {
    //   this.setSelected(prevInputId);
    //   return;
    // }
    const isBackspace = this.ifBackspaceOrDelete($event);
    if (isBackspace && !$event.target.value) {
      this.currentInputId = this.appendKey(`otp_${inputIdx}`);
      this.setSelected(prevInputId);
      this.rebuildValue();
      return;
    }
    if (!$event.target.value) {
      return;
    }
    if (this.ifValidEntry($event)) {
      this.currentInputId = nextInputId;
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  appendKey(id: any) {
    return `${id}_${this.componentKey}`;
  }

  setSelected(eleId: any) {
    this.focusTo(eleId);
    const ele: any = document.getElementById(eleId);
    // if (ele && ele.setSelectionRange) {
    //   setTimeout(() => {
    //     ele.setSelectionRange(0, 1);
    //   }, 0);
    // }
  }

  ifValidEntry(event: any) {
    const inp = String.fromCharCode(event.keyCode);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (this.config.allowKeyCodes &&
        this.config.allowKeyCodes.includes(event.keyCode)) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  focusTo(eleId?: any) {
    const ele: any = document.getElementById(eleId);
    if (ele) {
      ele.focus();
    } else {
      this.rebuildValue();
    }
  }

  // method to set component value
  setValue(value: any) {
    if (isNaN(value)) {
      return;
    }
    this.otpForm.reset();
    if (!value) {
      this.rebuildValue();
      return;
    }
    value = value.toString().replace(/\s/g, ''); // remove whitespace
    Array.from(value).forEach((c, idx) => {
      if (this.otpForm.get(this.getControlName(idx))) {
        this.otpForm.get(this.getControlName(idx))!.setValue(c);
      }
    });
    if (!this.config.disableAutoFocus) { // true
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      var indexOfElementToFocus =
        value.length < this.length ? value.length : this.length - 1;
      let ele: any = containerItem!.getElementsByClassName('otp-input')[
        indexOfElementToFocus
      ];
      if (ele && ele.focus) {
        ele.focus();
      }
    }
    this.rebuildValue();
  }

  rebuildValue() {
    let val = '';
    this.keysPipe.transform(this.otpForm.controls).forEach((k) => {
      if (this.otpForm.controls[k].value) {
        val += this.otpForm.controls[k].value;
      }
    });
    this.onInputChange.emit(val);
  }

  handlePaste(e: any) {
    // Get pasted data via clipboard API
    let clipboardData = e.clipboardData // || window['clipboardData'];
    if (clipboardData) {
      var pastedData = clipboardData.getData('Text');
    }
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    if (!pastedData) {
      return;
    }
    this.setValue(pastedData);
  }

  onChange = (value: any) => { };
  registerOnChange(fn: () => void): void {
      this.onChange = fn;
    }
}
