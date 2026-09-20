import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {APP_CONFIG} from '../app.config.token';
import {MatCardModule} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatCardModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  protected readonly environment = inject(APP_CONFIG);

  ngOnInit(): void {
  }

}
