import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
  @Input() images = [];
  src = '';
  constructor() {}

  ngOnInit() {
    if (this.images?.length) {
      const item: any = this.images.find((el: any) => el.variant === 'MAIN');
      this.src = item?.url;
    }
  }
}
