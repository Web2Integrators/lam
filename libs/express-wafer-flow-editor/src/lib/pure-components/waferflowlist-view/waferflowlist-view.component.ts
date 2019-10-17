import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ewfe-waferflowlist-view',
  templateUrl: './waferflowlist-view.component.html',
  styleUrls: ['./waferflowlist-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaferflowlistViewComponent implements OnInit {
  @Input() public collectionNames: string[];
  @Input() public waferFlows: string[];
  @Output() onCollectionNameChanged = new EventEmitter<any>();

  collectionControl = new FormControl('');

  constructor() {
    console.log(this.collectionNames);
  }

  onSelectionChange(event)
  {
    this.onCollectionNameChanged.emit(event.value)
  }

  ngOnInit() {}
}
