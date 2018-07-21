import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainComponent} from './container/main/main.component';
import {AuthenticationComponent} from './container/authentication/authentication.component';

const routes: Routes = [
  {path: 'welcome', component: AuthenticationComponent},
  {path: 'main', component: MainComponent},
  {path: '', component: AuthenticationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }