import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LanguageEnum, LanguageEnumUtils} from "../_services/translate/language-enum";
import {CustomTranslateService} from "../_services/translate/custom-translate.service";
import {AssetsService} from "../_services/util/assets.service";
import {Subscription} from "rxjs";
import {ScrollService} from "../_services/util/scroll.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private scrollService: ScrollService
  ) {

  }

  ngOnInit(): void {
  }


  protected readonly environment = environment;
}
