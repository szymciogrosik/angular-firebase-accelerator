import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {MatDialog} from "@angular/material/dialog";
import {RegistrationDetailsDialog} from "../../_models/registration/details/registration-details-dialog";
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {DetailsComponent} from "../details/details.component";
import {Subscription} from "rxjs";
import {ScrollService} from "../../_services/util/scroll.service";
import {SpecialPriceData} from "../../_models/registration/special-price-data";

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
  ) {
    this.scrollSubscription = this.scrollService.scrollRequest.subscribe((elementId: string) => {
      if (elementId === 'registrationHeader') {
        this.scrollToElement();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    if (this.subscriptionToStartRegistration) {
      this.subscriptionToStartRegistration.unsubscribe();
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
