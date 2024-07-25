import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() chartLabels: string[] = [];
  @Input() data: any = [];
  @Input() chartType: ChartType = 'doughnut';
  @Input() backgroundColor: string[] = [];
  chartData: any;

  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.chartData = {
        // labels: this.chartLabels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.backgroundColor,
          },
        ],
        options: {
          cutout: '50%',
          radius: 30,
          borderWidth: 1,
        },
      };
      console.log(this.chartData);
    }
  }
}
