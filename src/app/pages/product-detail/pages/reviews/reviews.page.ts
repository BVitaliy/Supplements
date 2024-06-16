import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  backBtnSubscription!: Subscription;
  @Input() product: any;
  @Input() reviews: any[] = [];
  averageAmount: any = '0';

  ratingCounts: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (this.reviews) {
      this.calculateRatings();
      this.averageAmount = (
        this.reviews.reduce((sum, review) => sum + review.rating, 0) /
        this.reviews.length
      ).toFixed(1);
    }
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
  }

  async cancelModal(body?: any) {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }

    await this.modalController.dismiss(body);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  calculateRatings(): void {
    this.reviews.forEach((review) => {
      if (this.ratingCounts[review.rating] !== undefined) {
        this.ratingCounts[review.rating]++;
      }
    });
  }

  getRatingPercentage(rating: number): string {
    const totalReviews = this.reviews.length;
    if (totalReviews === 0) return '0%';
    const percentage = (this.ratingCounts[rating] / totalReviews) * 100;
    return `${percentage.toFixed(2)}%`;
  }
}
