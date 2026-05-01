import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CustomTranslateService} from './_services/translate/custom-translate.service';
import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {Title} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [FooterComponent, NavbarComponent, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly translateService = inject(CustomTranslateService);
  private readonly titleService = inject(Title);

  constructor() {
    this.translateService.getPromise('page.title')
      .then(value => this.titleService.setTitle(value))
      .catch(err => console.error(err));
  }

}
