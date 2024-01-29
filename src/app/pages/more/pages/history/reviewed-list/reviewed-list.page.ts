import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reviewed-list',
  templateUrl: './reviewed-list.page.html',
  styleUrls: ['./reviewed-list.page.scss'],
})
export class ReviewedListPage {
  @Input() reviewedProducts: any[] = [];
}
