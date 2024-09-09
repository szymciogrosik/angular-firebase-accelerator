import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {MatDialog} from "@angular/material/dialog";
import {RegistrationDetailsDialog} from "../../_models/registration/details/registration-details-dialog";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {DetailsComponent} from "../details/details.component";
import {PublicRegistrationSettingsService} from "../../_services/database/settings/public-registration-settings.service";
import {from, interval, Subscription, switchMap} from "rxjs";
import {ScrollService} from "../../_services/util/scroll.service";
import {RegistrationGuardService} from "../../_services/guard/registration-guard.service";
import {DateTime} from "luxon";
import {SpecialPriceData} from "../../_models/registration/special-price-data";
import {PriceService} from "../../_services/business/price.service";

@Component({
  selector: 'app-form-buttons',
  templateUrl: './form-buttons.component.html',
  styleUrls: ['./form-buttons.component.scss']
})
export class FormButtonsComponent implements OnInit, OnDestroy {
  @ViewChild('registrationHeader') registrationHeader: ElementRef;
  private scrollSubscription: Subscription;

  protected readonly RedirectionEnum = RedirectionEnum;

  protected countdownToStartRegistration: any;
  private subscriptionToStartRegistration: Subscription = new Subscription();

  protected registrationEnabled: boolean = false;
  public price: SpecialPriceData = new SpecialPriceData(999999, false, 999999, "");

  constructor(
    private scrollService: ScrollService,
    private dialog: MatDialog,
    public translateService: CustomTranslateService,
    private registrationGuardService: RegistrationGuardService,
    private registrationSettingsService: PublicRegistrationSettingsService,
    private priceService: PriceService
  ) {
    this.enableRegistrationIfAllowed();
    this.scrollSubscription = this.scrollService.scrollRequest.subscribe((elementId: string) => {
      if (elementId === 'registrationHeader') {
        this.scrollToElement();
      }
    });
    priceService.getSpecialPrice().then(price => {
      this.price = price
    });
  }

  ngOnInit() {
    this.startCounterDownFunctionality();
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    if (this.subscriptionToStartRegistration) {
      this.subscriptionToStartRegistration.unsubscribe();
    }
  }

  private startCounterDownFunctionality(): void {
    this.subscriptionToStartRegistration = from(this.registrationSettingsService.getRegistrationStartDateTime())
      .pipe(
        switchMap(targetDateTime => {
          return interval(1000).pipe(
            switchMap(() => {
              return from(this.updateCountdown(targetDateTime));
            })
          );
        })
      )
      .subscribe({
        next: (countdown) => this.countdownToStartRegistration = countdown,
        error: (error) => console.error('Failed to get date time:', error)
      });
  }

  private enableRegistrationIfAllowed(): void {
    // Disabled registration from button as deadline passed
    // this.registrationGuardService.isRegistrationAllowed().then(
    //   response => this.registrationEnabled = response
    // );
  }

  private async updateCountdown(targetDateTime: DateTime): Promise<any> {
    const now = DateTime.local();
    const diff = targetDateTime.diff(now, ['hours', 'minutes', 'seconds']).toObject();
    if (targetDateTime > now) {
      return { hours: diff.hours, minutes: diff.minutes, seconds: Math.floor(diff.seconds || 0) };
    } else {
      this.subscriptionToStartRegistration.unsubscribe();
      this.enableRegistrationIfAllowed();
      return null;
    }
  }

  protected scrollToElement(): void {
    this.registrationHeader.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected redirectTo(redirectionEnum: RedirectionEnum): any {
    window.location.href = redirectionEnum;
  }

  protected openRegistrationDetailsYoung(): any {
    const dialogRef = this.dialog.open(
      DetailsComponent,
      {
        maxWidth: '800px',
        width: '600px',
        disableClose: true,
        data: new RegistrationDetailsDialog(
          this.translateService.get('bk.conferenceDetails.conferenceForYoung'),
          this.translateService.get('bk.conferenceDetails.conferenceYoungAdditionalInfo')
        )
      }
    );
  }

  protected openRegistrationDetailsAdult(): any {
    const dialogRef = this.dialog.open(
      DetailsComponent,
      {
        maxWidth: '800px',
        width: '600px',
        disableClose: true,
        data: new RegistrationDetailsDialog(
          this.translateService.get('bk.conferenceDetails.conferenceForAdult'),
          null
        )
      }
    );
  }

}
