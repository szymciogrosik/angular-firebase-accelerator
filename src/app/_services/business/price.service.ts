import {Injectable} from '@angular/core';
import {PublicRegistrationSettingsService} from "../database/settings/public-registration-settings.service";
import {DateService} from "../util/date.service";
import {SpecialPriceData} from "../../_models/registration/special-price-data";

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(
    private publicRegistrationService: PublicRegistrationSettingsService,
    protected dateService: DateService
  ) { }

  public async getSpecialPrice(): Promise<SpecialPriceData> {
    let standardPrice = 0;
    let promoEndDatePrice = "";
    let promoPrice = 0;
    let promoEnabled = false;

    try {
      standardPrice = await this.publicRegistrationService.getStandardPrice();
      const isEnabled = await this.publicRegistrationService.isPromoPriceEnabled();

      if (isEnabled) {
        const promoEndDatePriceTmp = await this.publicRegistrationService.getPromoEndDateTime();
        promoEndDatePrice = this.dateService.presentDateTime(promoEndDatePriceTmp);

        if (this.dateService.getCurrentDateTime().toMillis() < promoEndDatePriceTmp.toMillis()) {
          promoPrice = await this.publicRegistrationService.getPromoPrice();
          promoEnabled = true;
        }
      }
    } catch (error) {
      console.error("Error fetching special price data:", error);
      throw error;
    }

    return new SpecialPriceData(standardPrice, promoEnabled, promoPrice, promoEndDatePrice);
  }
}
