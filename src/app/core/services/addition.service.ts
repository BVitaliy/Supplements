// /* eslint-disable max-len */
// import { Injectable } from '@angular/core';
// import { AdMob, AdMobRewardItem, AdOptions, BannerAdOptions, BannerAdPluginEvents, BannerAdPosition, BannerAdSize, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
// import { isPlatform } from '@ionic/angular';
// import { ReplaySubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdditionService {
//   addPadding: ReplaySubject<number> = new ReplaySubject<number>(0);

//   constructor() { }

//   async initialize() {
//     // const { status } = await AdMob.trackingAuthorizationStatus();
//     // if (status === 'denied') { return; }

//     // if (status === 'authorized') {
//     //   // For production
//     //   AdMob.initialize({
//     //     requestTrackingAuthorization: true,
//     //   }).then(() => {
//     //     this.showBanner();
//     //     // this.showInterstitial();
//     //     // this.showRewardVideo();
//     //   });
//     //   // // For testening
//     //   // AdMob.initialize({
//     //   //   requestTrackingAuthorization: true,
//     //   //   testingDevices: ['YourTestDeviceCode'],
//     //   //   initializeForTesting: true,
//     //   // }).then(() => {
//     //   //   this.showBanner();
//     //   //   // this.showInterstitial();
//     //   //   // this.showRewardVideo();
//     //   // });
//     // }
//   }

//   async showBanner() {
//     // For production
//     const adId = isPlatform('ios') ? '' : '';
//     const options: BannerAdOptions = {
//       adId,
//       adSize: BannerAdSize.BANNER,
//       position: BannerAdPosition.BOTTOM_CENTER,
//       margin: 0
//     };
//     // // For testening
//     // const adId = isPlatform('ios') ? 'iosAdId' : 'androidAdId'
//     // const options: BannerAdOptions = {
//     //   adId,
//     //   adSize: BannerAdSize.BANNER,
//     //   position: BannerAdPosition.BOTTOM_CENTER,
//     //   margin: 0,
//     //   isTesting: true,
//     // };

//     AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
//       this.addPadding.next(60);
//     });

//     await AdMob.showBanner(options);
//   }

//   async hide() {
//     // await AdMob.hideBanner();
//     // await AdMob.removeBanner();
//   }

//   async showInterstitial() {
//     const adId = isPlatform('ios') ? 'iosAdId' : 'androidAdId';
//     const options: AdOptions = {
//       adId,
//       isTesting: true,
//     };

//     await AdMob.prepareInterstitial(options);
//     await AdMob.showInterstitial();
//   }

//   async showRewardVideo() {
//     AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
//       console.log('REWARD', reward);
//     });

//     const adId = isPlatform('ios') ? 'iosAdId' : 'androidAdId';
//     const options: RewardAdOptions = {
//       adId,
//       isTesting: true,
//     };

//     await AdMob.prepareRewardVideoAd(options);
//     await AdMob.showRewardVideoAd();
//   }

//   get getValue() {
//     return this.addPadding;
//   }
// }
