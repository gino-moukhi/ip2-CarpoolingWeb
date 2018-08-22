import {NgModule} from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatCardModule,
  MatGridListModule,
  MatTabsModule,
  MatExpansionModule
} from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
  ],
  exports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule
  ]
})
export class AppMaterialModule {
}
