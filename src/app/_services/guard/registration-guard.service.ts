import {Injectable} from '@angular/core';
import {PublicRegistrationSettingsService} from "../database/settings/public-registration-settings.service";
import {DateTime} from "luxon";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuardService {

  constructor(
    private publicRegistrationSettings: PublicRegistrationSettingsService
  ) { }

  public async isRegistrationAllowed(): Promise<boolean> {
    try {
      let enabled: boolean = await this.publicRegistrationSettings.isRegistrationEnabled();
      if (enabled) {
        return this.isCorrectRegistrationStartDateTime();
      } else {
        return this.rejectAccessToPage();
      }
    } catch (error) {
      console.error('Error checking registration enabled status', error);
      return this.rejectAccessToPage();
    }
  }

  private async isCorrectRegistrationStartDateTime(): Promise<boolean> {
    try {
      let startRegistrationDateTime: DateTime<boolean> = await this.publicRegistrationSettings.getRegistrationStartDateTime();
      let isBeforeStartRegistrationDateTime: boolean = DateTime.now().toMillis() < startRegistrationDateTime.toMillis();
      return isBeforeStartRegistrationDateTime ? this.rejectAccessToPage() : this.allowAccessToPage();
    } catch (error) {
      console.error('Error checking registration start date time', error);
      return this.rejectAccessToPage();
    }
  }

  private allowAccessToPage(): Promise<boolean> {
    return Promise.resolve(true);
  }

  private rejectAccessToPage(): Promise<boolean> {
    return Promise.resolve(false);
  }

}
