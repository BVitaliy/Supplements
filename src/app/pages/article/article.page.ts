import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { ProfileService } from '../more/profile.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit {
  isLoading = false;
  type = '';
  data: any;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  doRefresh(event: any) {
    this.getData(() => event.target.complete());
  }

  ionViewWillEnter() {
    this.type = this.route.snapshot.paramMap.get('slug') || '';

    this.getData();
  }

  getData(callbackFunction?: () => void) {
    this.isLoading = true;
    if (this.type === 'privacy') {
      this.profileService
        .getPolicy()
        .pipe(
          finalize(() => {
            this.isLoading = false;
            if (callbackFunction) {
              callbackFunction();
            }
          })
        )
        .subscribe(
          (data: any) => {
            this.data = data?.html;
          },
          (error: any) => {}
        );
    } else {
      this.profileService
        .getTerms()
        .pipe(
          finalize(() => {
            this.isLoading = false;
            if (callbackFunction) {
              callbackFunction();
            }
          })
        )
        .subscribe(
          (data: any) => {
            this.data = data?.html;
          },
          (error: any) => {}
        );
    }
  }
}
