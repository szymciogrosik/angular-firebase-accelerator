import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StarterShowcaseComponent} from './starter-showcase/starter-showcase.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [StarterShowcaseComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
