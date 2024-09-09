import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ScrollService} from "../../_services/util/scroll.service";

@Component({
  selector: 'app-what-is-bk-conf',
  templateUrl: './what-is-bk-conf.component.html',
  styleUrls: ['./what-is-bk-conf.component.scss']
})
export class WhatIsBkConfComponent implements OnDestroy {
  @ViewChild('whatBKIsId') whatBKIsId: ElementRef;
  private scrollSubscription: Subscription;

  constructor(
    private scrollService: ScrollService
  ) {
    this.scrollSubscription = this.scrollService.scrollRequest.subscribe((elementId: string) => {
      if (elementId === 'whatBKIsId') {
        this.scrollToElement();
      }
    });
  }

  scrollToElement(): void {
    this.whatBKIsId.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

}
