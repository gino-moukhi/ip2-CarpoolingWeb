import {NgModule} from '@angular/core';
import { MatToolbarModule, MatButtonModule, /*MatSidenavModule,*/ MatIconModule, MatListModule } from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule
  ],
  exports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule
  ]
})
export class AppMaterialModule {
}
