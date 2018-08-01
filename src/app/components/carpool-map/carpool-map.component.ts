import {Component, NgZone, OnInit} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {RouteDefinition} from '../../models/route/route-definition';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RouteLocation} from '../../models/route/route-location';
import PlaceResult = google.maps.places.PlaceResult;
import {RouteService} from '../../services/route.service';
import {RouteComplete} from '../../models/route/route-complete';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {RouteWaypoint} from '../../models/route/route-waypoint';
import {RouteType} from '../../models/route/route-type.enum';

declare var google: any;

@Component({
  selector: 'app-carpool-map',
  templateUrl: './carpool-map.component.html',
  styleUrls: ['./carpool-map.component.css']
})
export class CarpoolMapComponent implements OnInit {
  home: RouteLocation;
  completeRoute = false;
  currentMapInstance: google.maps.Map;
  routeForm: FormGroup;
  trafficLayer: google.maps.TrafficLayer;
  routeDefinition: RouteDefinition;

  allRoutes: RouteComplete[];
  currentUser: User;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.routeForm = this.fb.group({
      origin: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }, Validators.required),
      destination: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }, Validators.required),
      routeType: new FormControl(Validators.required),
      waypoints: this.fb.array([this.initWaypointFields()])
    });

    this.home = new RouteLocation('', 0, 0);
    // this.setCurrentPosition();
    this.routeService.getRoutes().subscribe(value => {
      // this.allRoutes = value;
      console.log(this.allRoutes);
      console.log('val');
      console.log(value);
    });
    this.routeService.getRouteById('5b5f64efd3303d23c8700281').subscribe(value => {
      console.log('val');
      console.log(value);
    });

    this.userService.getUserById(sessionStorage.getItem('currentUser')).subscribe(value => {
      this.currentUser = value;
      console.log(this.currentUser);
    });
  }

  private initWaypointFields(): FormGroup {
    return this.fb.group({
      name: [],
      waypoint: []
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('1');
        console.log(this.home);
        this.home = new RouteLocation('', position.coords.latitude, position.coords.longitude);
        console.log('2');
        console.log(this.home);
      });
    }
  }

  changeMapLayerToTraffic() {
    // let traffic = new google.maps.TrafficLayer();
    if (this.trafficLayer.getMap() == null) {
      this.trafficLayer.setMap(this.currentMapInstance);
    } else {
      this.trafficLayer.setMap(null);
    }
  }

  onMapReady(mapInstance) {
    this.currentMapInstance = mapInstance;
    this.setCurrentPosition();
    // this.currentMapInstance.setCenter(new google.maps.LatLng(this.home.lat, this.home.lng));
    console.log('3');
    console.log(this.home);
    this.trafficLayer = new google.maps.TrafficLayer();
    console.log('4');
    console.log(this.home);
  }

  createWaypoint() {
    const control = <FormArray>this.routeForm.controls.waypoints;
    control.push(this.initWaypointFields());
  }

  removeWaypoint(i: number) {
    const control = <FormArray>this.routeForm.controls.waypoints;
    control.removeAt(i);
  }

  autoCompleter(event) {
    this.mapsAPILoader.load().then(() => {
      const autoComplete = new google.maps.places.Autocomplete(event.target);
      autoComplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autoComplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          if (event.target.id === 'origin') {
            const control = this.routeForm.controls.origin;
            this.setFormValue(place, control, event.target.id);

          } else if (event.target.id === 'destination') {
            const control = this.routeForm.controls.destination;
            this.setFormValue(place, control, event.target.id);

          } else if (event.target.id.includes('wp')) {
            const controls = <FormArray>this.routeForm.controls.waypoints;
            this.setFormValue(place, controls, event.target.id);
          }
        });
      });
    });
  }

  createRoute() {
    if (this.routeForm.invalid) {
      return;
    }
    const completeWaypoints = [];
    const wps = <FormArray>this.routeForm.controls.waypoints;
    console.log(wps);
    const waypointsAsLocation = [];
    for (let i = 0; i < wps.length; i++) {
      if (wps.value[i].waypoint !== null) {
        completeWaypoints.push(wps.value[i].waypoint);
        const loc = {
          name: wps.value[i].waypoint.location.name,
          lat: wps.value[i].waypoint.location.lat,
          lng: wps.value[i].waypoint.location.lng,
        };
        waypointsAsLocation.push(loc);
      }
    }
    console.log(completeWaypoints);
    console.log(waypointsAsLocation);

    this.routeDefinition = new RouteDefinition(this.routeForm.controls.origin.value.location,
      this.routeForm.controls.destination.value.location, this.routeForm.controls.routeType.value, completeWaypoints);

    if (!this.routeDefinition.origin) {
      console.log('please enter a start location to complete the route');
    } else if (!this.routeDefinition.destination) {
      console.log('please enter a destination to complete the route');
    } else if (this.routeForm.controls.routeType.untouched) {
      console.log('please pick a route type (single or return)');
    } else {
      this.completeRoute = true;
    }

    console.log(this.routeDefinition);
    if (this.completeRoute) {
      const routeDefinitionForBackEnd = new RouteDefinition(this.routeDefinition.origin, this.routeDefinition.destination,
        this.routeForm.controls.routeType.value, waypointsAsLocation);

      console.log(routeDefinitionForBackEnd);
      const complete = new RouteComplete(routeDefinitionForBackEnd, this.currentUser.vehicle.type, new Date(),
        this.currentUser.vehicle.numberOfPassengers);
      console.log(complete);
      this.routeService.createRoute(complete).subscribe();
    }
  }

  clearRoute() {
    this.completeRoute = !this.completeRoute;

    const wps = <FormArray>this.routeForm.controls.waypoints;

    // this.routeDirection = null;
    this.routeForm.controls.origin.value.name = null;
    this.routeForm.controls.origin.value.location = null;
    this.routeForm.controls.destination.value.name = null;
    this.routeForm.controls.destination.value.location = null;
    this.routeForm.controls.routeType.setValue(null);

    for (let i = 0; i < wps.length; i++) {
      /*wps.value[i].name = null;
      wps.value[i].waypoint = null;*/
      console.log(i);
      console.log(wps.length);
      this.removeWaypoint(i);
      console.log(this.routeForm.controls.waypoints);
    }

    console.log(this.routeForm);
    console.log(this.routeDefinition);
    console.log(this.completeRoute);
  }

  private setFormValue(place: PlaceResult, control: AbstractControl, id: string) {
    console.log(control);
    let data;
    let wpControl;
    if (control instanceof FormGroup) {
      data = {
        name: place.formatted_address,
        location: new RouteLocation(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng())
      };
      control.setValue(data);
    } else if (control instanceof FormArray) {
      const splits = id.split('.');
      wpControl = control.controls[splits[1]];
      data = {
        name: place.formatted_address,
        /*waypoint: new RouteLocation(place.formatted_address, place.geometry.location.lat(),
          place.geometry.location.lng())*/
        // must make use of RouteWaypoint because the used api's require a location property (and optionally a stopover boolean)
        waypoint: new RouteWaypoint(new RouteLocation(place.formatted_address, place.geometry.location.lat(),
          place.geometry.location.lng()), true)
      };
      wpControl.setValue(data);
    }
  }
}
