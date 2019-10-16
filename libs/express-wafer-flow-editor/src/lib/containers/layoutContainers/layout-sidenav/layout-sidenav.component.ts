import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { getSession } from '@lamresearch/session-manager';
@Component({
  selector: 'ewfe-layout-sidenav',
  templateUrl: './layout-sidenav.component.html',
  styleUrls: ['./layout-sidenav.component.scss']
})
export class LayoutSidenavComponent implements OnInit {

  constructor(public store: Store<{}>) { }

  ngOnInit() {

    this.store.pipe(select(getSession)).subscribe(val => {
      console.log(val);
    });
  }

}
