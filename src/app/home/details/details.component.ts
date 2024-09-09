import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {RegistrationDetailsDialog} from "../../_models/registration/details/registration-details-dialog";
import {SpecialPriceData} from "../../_models/registration/special-price-data";
import {PriceService} from "../../_services/business/price.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  public price: SpecialPriceData = new SpecialPriceData(999999, false, 999999, "");

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegistrationDetailsDialog,
    private priceService: PriceService
  ) {
    priceService.getSpecialPrice().then(price => {
      this.price = price
    });
  }

}
