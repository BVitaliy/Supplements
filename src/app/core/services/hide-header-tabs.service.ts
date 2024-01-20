import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HideHeaderTabsService {
  isShowTab = true;
  isShowHeader = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.init();
  }

  get isShowTabs() {
    return this.isShowTab;
  }

  get isShowHeaders() {
    return this.isShowHeader;
  }

  private init() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isShowTab = true;
        this.isShowHeader = true;
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.lastChildren(this.route.children, (children: ActivatedRoute[]) => {
          if (children[0].snapshot.data['hideHeader']) {
            this.isShowHeader = false;
          }
          if (children[0].snapshot.data['hideTab']) {
            this.isShowTab = false;
          }
        });
      }
    });
  }

  private lastChildren(children: ActivatedRoute[], cb: any) {
    const last = children;
    if (children[0].children.length) {
      this.lastChildren(children[0].children, cb);
    } else {
      cb(children);
    }
  }
}
