import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplement-fact',
  templateUrl: './supplement-fact.component.html',
  styleUrls: ['./supplement-fact.component.scss'],
})
export class SupplementFactComponent implements OnInit {
  @Input() product: any;

  constructor() {}

  ngOnInit() {}
}
