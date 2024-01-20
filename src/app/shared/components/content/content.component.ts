import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, AfterViewInit {
  @Input() toggle = false;
  @Input() opened = true;
  @Input() currentHeight!: string;
  @ViewChild('more', { static: false }) moreRef!: ElementRef;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.getContentHeight();
  }

  getContentHeight() {
    const interval = setInterval(() => {
      if (this.moreRef?.nativeElement?.offsetHeight) {
        this.currentHeight = this.moreRef.nativeElement.offsetHeight + 'px';
        clearInterval(interval);
      }
    }, 10);
  }

  onToggle(): void {
    this.getContentHeight();
    if (this.toggle) {
      this.opened = !this.opened;
    }
  }
}
