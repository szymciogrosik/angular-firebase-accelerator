import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {
  constructor(
  ) {
  }

  protected openLink(link: string) {
    window.location.href = link;
  }

}
