import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor() {
  }

  protected openLink(link: string) {
    window.open(link, '_blank');
  }

}
