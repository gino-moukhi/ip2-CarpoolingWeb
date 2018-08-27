import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {AppRoutingModule} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from './services/authentication.service';
import {UserService} from './services/user.service';
import {RegisterComponent} from './components/register/register.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AuthenticationComponent} from './container/authentication/authentication.component';
import {CreateRouteComponent} from './components/create-route/create-route.component';
import {AgmCoreModule} from '@agm/core';
import {AgmDirectionModule} from 'agm-direction';
import {RouteDetailComponent} from './components/route-detail/route-detail.component';
import {CommunicationFormComponent} from './components/communication-form/communication-form.component';
import {RouteMyroutesComponent} from './components/route-myroutes/route-myroutes.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from './app.material-module';
import {LayoutModule} from '@angular/cdk/layout';
import {MainComponent} from './container/main/main.component';
import {RouteSearcherComponent} from './components/route-searcher/route-searcher.component';
import {RouteContainerComponent} from './container/route-container/route-container.component';
import { RouteEditDialogComponent } from './components/route-edit-dialog/route-edit-dialog.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AuthenticationComponent,
    CreateRouteComponent,
    RouteContainerComponent,
    RouteDetailComponent,
    CommunicationFormComponent,
    RouteMyroutesComponent,
    MainComponent,
    RouteSearcherComponent,
    RouteEditDialogComponent,
    EmptyStateComponent,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAoYIznqFlSQUuZN5TJ1AWLFJnU8gMDvQU',
      libraries: ['places']
    }),
    AgmDirectionModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    LayoutModule,
  ],
  providers: [AuthenticationService, UserService],
  bootstrap: [AppComponent],
  entryComponents: [RouteDetailComponent, CommunicationFormComponent, RouteEditDialogComponent]
})
export class AppModule {
}
