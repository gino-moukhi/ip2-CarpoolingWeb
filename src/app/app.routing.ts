import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthenticationComponent} from './container/authentication/authentication.component';
import {MainComponent} from './container/main/main.component';

const routes: Routes = [
  {path: 'authentication', component: AuthenticationComponent},
  {path: 'main', component: MainComponent},
  {path: '', component: AuthenticationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
