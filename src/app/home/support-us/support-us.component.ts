import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ScrollService} from "../../_services/util/scroll.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-support-us',
  templateUrl: './support-us.component.html',
  styleUrl: './support-us.component.scss'
})
export class SupportUsComponent implements OnDestroy {
  @ViewChild('supportUsContainer') supportUsContainer: ElementRef;
  private scrollSubscription: Subscription;

  constructor(
    private scrollService: ScrollService
  ) {
    this.scrollSubscription = this.scrollService.scrollRequest.subscribe((elementId: string) => {
      if (elementId === 'supportUsContainer') {
        this.scrollToElement();
      }
    });
  }

  scrollToElement(): void {
    this.supportUsContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

}
