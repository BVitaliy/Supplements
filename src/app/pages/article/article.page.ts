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
    console.log(this.type);
    this.getData();
  }

  getData(callbackFunction?: () => void) {
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
            // this.data = data;
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
            // this.data = data;
          },
          (error: any) => {}
        );
    }
    this.data = `                <h4>1.Introduction</h4>
<p>This Privacy Policy describes how [NAME] Inc. and its affiliates will gather, use, maintain and protect your Personal Information on the [NAME] Platform. It will also disclose your legal rights with respect to said Personal Information.</p>
<p>By using the [NAME] Site or Services (“Platform”), you affirm that you have read and understand this Privacy Policy and our Terms of Service per the Agreement. The Agreement governs the use of the Platform. [NAME] will collect, use, maintain and protect information consistent with the Agreement.</p>
<h4>2.General Terms</h4>
<p>In this Privacy Policy:</p>
<ul>
<li>[NAME] can be referred to as:<b>“[NAME],” ”we,” ”our”</b></li>
<li>A User of [NAME] may be referred to as: “<b>User,”&nbsp;</b>“<b>Users,” “You,” “Your,”&nbsp;</b>and&nbsp;<b>“Professional” or “Clinic”</b>&nbsp;depending on the User’s status.</li>
<li>The [NAME] Site, Services as well as the Platform are together referred to as&nbsp;<b>“Platform”</b></li>
<li>The functionality of [NAME]’s Site, Applications, Services, information and Communications can be referred to as&nbsp;<b>“[NAME] Platform”</b></li>
<li>The Terms of Service and the Privacy Policy are collectively referred to as&nbsp;<b>“Terms”</b></li>
</ul>
<h4>3.Information Collection</h4>
<p><b>Information you provide to [NAME].</b></p>
<p>[NAME] collects personally identifiable information about you, including information that can identify, describe, and be associated with you. (<b>“Personal Information”)</b>&nbsp;Below lie some examples of Personal Information:</p>
<p><b>Contact Information:</b>&nbsp;First and last name, postal code, phone number, and email address.</p>
<p><b>Employment Information:</b>&nbsp;Academic history, experience, references, etc.</p>
<p><b>Identity Information:</b>&nbsp;As a Professional, we may collect Personal Information. For example, date of birth, address, driver’s license, and national id number, which can be used for basic criminal background checks as provided by you, and extended by the law in your jurisdiction, as well as some information which may be needed to validate your identity.</p>
<p><b>Content Information.&nbsp;</b>You also may choose to send [NAME] Personal Information in an email or message containing inquiries about the [NAME] Platform and we use this Information in order to help us respond to said inquiries. We also collect content within any messages you exchange with other Users through the [NAME] Platform (such as through our chat functionality).</p>
<p>In order to deliver services through the [NAME] Platform, we require you to give some information when you establish an account with us. For example, if you are a Clinic we collect your first and last name, your Clinic’s name, phone number, email address, and your postal code in order to create and manage your [NAME] account. We also collect additional information in order to send out your booking request, such as information about the Shift you are seeking, the time, date and location of the Shift, and Billing Data. If you are a Professional, we collect your first and last name, email address, mobile phone number and zip or postal code in order to create and manage your [NAME] account and facilitate communications between you and the Clinics you service through the [NAME] Platform. We also collect information about your shifts, rates, and specialty, as well as Identity Information and Financial Information.</p>`;
  }
}
