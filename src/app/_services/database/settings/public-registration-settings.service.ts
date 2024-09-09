import {Injectable} from '@angular/core';
import {PublicSettingsService} from "./public-settings.service";
import {map, Observable} from "rxjs";
import {DateTime} from "luxon";
import {RegistrationSettings} from "../../../_models/settings/registration/registrationSettings";

@Injectable({
  providedIn: 'root'
})
export class PublicRegistrationSettingsService {

  constructor(
    private settingsService: PublicSettingsService
  ) {
  }

  private registrationSettingsKey: string = 'registration';

  // Is registration enabled
  public isRegistrationEnabled(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.isRegistrationEnabledObservable()
        .subscribe({
          next: (isEnabled) => resolve(Boolean(isEnabled)),
          error: (err) => reject(err)
        });
    });
  }

  public isRegistrationEnabledObservable(): Observable<boolean> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => response.registrationEnabled)
      );
  }

  public updateRegistrationEnabled(registrationEnabled: boolean): Promise<void> {
    let updateObject = { registrationEnabled: registrationEnabled };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

  // Registration Start Date Time
  public getRegistrationStartDateTimeObservable(): Observable<DateTime> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => DateTime.fromISO(response.startRegistrationDateTime))
      );
  }

  public getRegistrationStartDateTime(): Promise<DateTime> {
    return new Promise((resolve, reject) => {
      this.getRegistrationStartDateTimeObservable()
        .subscribe({
          next: (dateTime) => resolve(dateTime),
          error: (err) => reject(err)
        });
    });
  }

  public updateRegistrationStartDateTime(startRegistrationDateTime: DateTime): Promise<void> {
    let updateObject = { startRegistrationDateTime: startRegistrationDateTime.toString() };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

  // Standard price
  public getStandardPriceObservable(): Observable<number> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => response.standardPrice)
      );
  }

  public getStandardPrice(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getStandardPriceObservable()
        .subscribe({
          next: (standardPrice) => resolve(standardPrice),
          error: (err) => reject(err)
        });
    });
  }

  public updateStandardPrice(standardPrice: number): Promise<void> {
    let updateObject = { standardPrice: standardPrice };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

  // Is registration enabled
  public isPromoPriceEnabled(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.isPromoPriceEnabledObservable()
        .subscribe({
          next: (isEnabled) => resolve(Boolean(isEnabled)),
          error: (err) => reject(err)
        });
    });
  }

  public isPromoPriceEnabledObservable(): Observable<boolean> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => response.promoPriceEnabled)
      );
  }

  public updatePromoPriceEnabled(promoPriceEnabled: boolean): Promise<void> {
    let updateObject = { promoPriceEnabled: promoPriceEnabled };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

  // Promo endDate
  public getPromoEndDateTimeObservable(): Observable<DateTime> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => DateTime.fromISO(response.promoEndDate))
      );
  }

  public getPromoEndDateTime(): Promise<DateTime> {
    return new Promise((resolve, reject) => {
      this.getPromoEndDateTimeObservable()
        .subscribe({
          next: (dateTime) => resolve(dateTime),
          error: (err) => reject(err)
        });
    });
  }

  public updatePromoEndDateTime(promoEndDate: DateTime): Promise<void> {
    let updateObject = { promoEndDate: promoEndDate.toString() };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

  // Promo price
  public getPromoPriceObservable(): Observable<number> {
    return this.settingsService.getDocument(this.registrationSettingsKey)
      .pipe(
        map(response => response.promoPrice)
      );
  }

  public getPromoPrice(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getPromoPriceObservable()
        .subscribe({
          next: (promoPrice) => resolve(promoPrice),
          error: (err) => reject(err)
        });
    });
  }

  public updatePromoPrice(promoPrice: number): Promise<void> {
    let updateObject = { promoPrice: promoPrice };
    return this.settingsService.update(this.registrationSettingsKey, updateObject);
  }

}
