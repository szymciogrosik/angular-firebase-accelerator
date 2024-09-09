import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ScrollService} from "../../_services/util/scroll.service";

@Component({
  selector: 'app-bk-progress-description',
  templateUrl: './bk-progress-description.component.html',
  styleUrls: ['./bk-progress-description.component.scss']
})
export class BkProgressDescriptionComponent implements OnDestroy {
  @ViewChild('bkProgressId') bkProgressId: ElementRef;
  private scrollSubscription: Subscription;

  constructor(private scrollService: ScrollService) {
    this.scrollSubscription = this.scrollService.scrollRequest.subscribe((elementId: string) => {
      if (elementId === 'bkProgressId') {
        this.scrollToElement();
      }
    });
  }

  scrollToElement(): void {
    this.bkProgressId.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

}
