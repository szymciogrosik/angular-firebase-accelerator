import {Component} from '@angular/core';
import {ScrollService} from "../../_services/util/scroll.service";

@Component({
  selector: 'app-main-page-video',
  templateUrl: './main-page-video.component.html',
  styleUrls: ['./main-page-video.component.scss']
})
export class MainPageVideoComponent {

  constructor(private scrollService: ScrollService) {
  }

  scrollToRegistrationBoth(): void {
    this.scrollService.requestScrollTo("registrationHeader");
  }

}
