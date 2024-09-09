import {Component, OnDestroy} from '@angular/core';
import {DateTime} from "luxon";
import {Subscription} from "rxjs";
import {
  PublicRegistrationSettingsService
} from "../../../_services/database/settings/public-registration-settings.service";
import {AccessRoleService} from "../../../_services/auth/access-role.service";
import {AccessPage} from "../../../_services/auth/access-page";
import {DateService} from "../../../_services/util/date.service";

@Component({
  selector: 'app-settings-price',
  templateUrl: './settings-price.component.html',
  styleUrl: './settings-price.component.scss'
})
export class SettingsPriceComponent implements OnDestroy {
  private originalStandardPrice: number | null = null;
  protected originalStandardPriceInput: number | undefined = undefined;
  protected promoPriceEnabled: boolean | null = null;
  private originalPromoPrice: number | null = null;
  protected originalPromoPriceInput: number | undefined = undefined;
  private originalPromoPriceEndDate: DateTime | null = null;
  protected promoPriceEndDateInput: string | undefined = undefined;

  private standardPriceSubscription: Subscription;
  private promoPriceEnabledSubscription: Subscription;
  private promoPriceSubscription: Subscription;
  private promoPriceEndDateSubscription: Subscription;

  constructor(
    private registrationSettingsService: PublicRegistrationSettingsService,
    private accessService: AccessRoleService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.SETTINGS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.standardPriceSubscription?.unsubscribe();
    this.promoPriceEnabledSubscription?.unsubscribe();
    this.promoPriceSubscription?.unsubscribe();
    this.promoPriceEndDateSubscription?.unsubscribe();
  }

  private subscribe(): void {
    this.standardPriceSubscription = this.registrationSettingsService.getStandardPriceObservable().subscribe({
      next: (price: number) => {
        this.originalStandardPrice = price;
        this.originalStandardPriceInput = this.originalStandardPrice;
      },
      error: (err) => console.error(err)
    });
    this.promoPriceEnabledSubscription = this.registrationSettingsService.isPromoPriceEnabledObservable().subscribe({
      next: (promoPriceEnabled) => this.promoPriceEnabled = promoPriceEnabled,
      error: (err) => console.error(err)
    });
    this.promoPriceSubscription = this.registrationSettingsService.getPromoPriceObservable().subscribe({
      next: (promoPrice: number) => {
        this.originalPromoPrice = promoPrice;
        this.originalPromoPriceInput = this.originalPromoPrice;
      },
      error: (err) => console.error(err)
    });
    this.promoPriceEndDateSubscription = this.registrationSettingsService.getPromoEndDateTimeObservable().subscribe({
      next: (originalPromoPriceEndDate) => {
        this.originalPromoPriceEndDate = originalPromoPriceEndDate;
        this.promoPriceEndDateInput = this.originalPromoPriceEndDate?.toISO()?.slice(0, 16);
      }
    });
  }

  protected isStandardPriceDifferentAsInput(): boolean {
    let standardPrice: number | null = this.getStandardPriceInputValue();
    if (standardPrice === null || this.originalStandardPrice === null) {
      return false;
    }
    return !(this.originalStandardPrice === standardPrice);
  }

  private getStandardPriceInputValue(): number | null {
    if (!this.originalStandardPriceInput) {
      return null;
    }
    return this.originalStandardPriceInput;
  }

  protected updateStandardPrice(): void {
    let updatedPrice = this.getStandardPriceInputValue();
    if (updatedPrice === null) {
      return;
    }
    this.registrationSettingsService.updateStandardPrice(updatedPrice)
      .catch((err) => console.error(err));
  }

  protected updatePromoPriceEnabled(event: any): void {
    this.promoPriceEnabled = null;
    this.registrationSettingsService.updatePromoPriceEnabled(event.checked)
      .catch((err) => console.error(err));
  }

  protected isOriginalPromoPriceEndDateDifferentAsInput(): boolean {
    let updatedDateTime = this.getPromoPriceEndDateInputValue();
    if (updatedDateTime === null || this.originalPromoPriceEndDate === null) {
      return false;
    }
    return !(this.originalPromoPriceEndDate.toMillis() === updatedDateTime.toMillis());
  }

  private getPromoPriceEndDateInputValue(): DateTime | null {
    if (!this.promoPriceEndDateInput) {
      return null;
    }
    return DateTime.fromISO(this.promoPriceEndDateInput, { zone: DateService.timeZone });
  }

  protected updatePromoPriceEndDate(): void {
    let updatedDateTime = this.getPromoPriceEndDateInputValue();
    if (updatedDateTime === null) {
      return;
    }
    this.registrationSettingsService.updatePromoEndDateTime(updatedDateTime)
      .catch((err) => console.error(err));
  }

  protected isPromoPriceDifferentAsInput(): boolean {
    let updatedPrice: number | null = this.getPromoPriceInputValue();
    if (updatedPrice === null || this.originalPromoPrice === null) {
      return false;
    }
    return !(this.originalPromoPrice === updatedPrice);
  }

  private getPromoPriceInputValue(): number | null {
    if (!this.originalPromoPriceInput) {
      return null;
    }
    return this.originalPromoPriceInput;
  }

  protected updatePromoPrice(): void {
    let updatedPrice = this.getPromoPriceInputValue();
    if (updatedPrice === null) {
      return;
    }
    this.registrationSettingsService.updatePromoPrice(updatedPrice)
      .catch((err) => console.error(err));
  }

}
