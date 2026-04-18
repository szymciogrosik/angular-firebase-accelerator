import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatCardModule],
})
export class HomeComponent implements OnInit {
  constructor() {

  }

  ngOnInit(): void {
  }


  protected readonly environment = environment;
}
