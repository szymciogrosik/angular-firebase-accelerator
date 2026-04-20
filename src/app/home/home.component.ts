import {Component, OnInit, inject} from '@angular/core';
import {APP_CONFIG} from '../app.config.token';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatCardModule],
})
export class HomeComponent implements OnInit {
  protected readonly environment = inject(APP_CONFIG);

  ngOnInit(): void {
  }

}
