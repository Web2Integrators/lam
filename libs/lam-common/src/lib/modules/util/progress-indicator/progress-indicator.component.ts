import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

//import { AppState, hasPendingRequests } from '../../../app-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent {

  hasPendingRequests: Observable<boolean>;

  // constructor(store: Store<AppState>) {
  //   this.hasPendingRequests = store.pipe(
  //     select(hasPendingRequests)
  //   );
  // }
}
