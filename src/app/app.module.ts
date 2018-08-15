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
import {RouteFinderComponent} from './components/route-finder/route-finder.component';
import {RouteDetailComponent} from './components/route-detail/route-detail.component';
import {CommunicationFormComponent} from './components/communication-form/communication-form.component';
import { RouteMyroutesComponent } from './components/route-myroutes/route-myroutes.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from './app.material-module';
import { LayoutModule } from '@angular/cdk/layout';
import { MainComponent } from './container/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AuthenticationComponent,
    CreateRouteComponent,
    RouteFinderComponent,
    RouteDetailComponent,
    CommunicationFormComponent,
    RouteMyroutesComponent,
    MainComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
