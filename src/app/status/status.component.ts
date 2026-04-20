import {Component} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, map, of} from 'rxjs';
import {Status} from "../_models/status/status";
import {AssetsService} from "../_services/util/assets.service";
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatProgressSpinnerModule],
})
export class StatusComponent {
  private STATUS_URL: string = 'status/status.json';

  lastDeployTime = toSignal(
    this.readAssetsService.getResource(this.STATUS_URL).pipe(
      map((data: any) => data?.lastDeployTime || ''),
      catchError(error => {
        console.error(error);
        return of('');
      })
    ),
    { initialValue: '' }
  );

  constructor(private readAssetsService: AssetsService) {}

}
