import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {InfoWindow} from '@agm/core/services/google-maps-types';
import {RouteDirection} from '../../models/route/route-direction';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RouteLocation} from '../../models/route/route-location';
import {RouteWaypoint} from '../../models/route/route-waypoint';
import PlaceResult = google.maps.places.PlaceResult;

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
  routeDirection: RouteDirection;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.routeForm = this.fb.group({
      origin: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      destination: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      waypoints: this.fb.array([this.initWaypointFields()])
    });
    this.setCurrentPosition();
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
        this.home = new RouteLocation(position.coords.latitude, position.coords.longitude);
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
    this.currentMapInstance.setCenter(new google.maps.LatLng(this.home.lat, this.home.lng));
    this.trafficLayer = new google.maps.TrafficLayer();
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
    console.log(event.target);

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
            /*console.log(control);
            const origin = {
              name: place.formatted_address,
              location: new RouteLocation(place.geometry.location.lat(), place.geometry.location.lng())
            };
            control.setValue(origin);*/
            this.setFormValue(place, control, event.target.id);

          } else if (event.target.id === 'destination') {
            const control = this.routeForm.controls.destination;
            /*const destination = {
              name: place.formatted_address,
              location: new RouteLocation(place.geometry.location.lat(), place.geometry.location.lng())
            };
            control.setValue(destination);*/
            this.setFormValue(place, control, event.target.id);

          } else if (event.target.id.includes('wp')) {
            const controls = <FormArray>this.routeForm.controls.waypoints;
            /*const splits = event.target.id.split('.');
            const controls = <FormArray>this.routeForm.controls.waypoints;
            const control = controls.controls[splits[1]];
            const wp = {
              name: place.formatted_address,
              waypoint: new RouteWaypoint(new RouteLocation(place.geometry.location.lat(), place.geometry.location.lng()), true)
            };
            control.setValue(wp);*/
            this.setFormValue(place, controls, event.target.id);
          }
        });
      });
    });
  }

  createRoute() {
    const data = [];
    const wps = <FormArray>this.routeForm.controls.waypoints;
    console.log(wps);
    for (let i = 0; i < wps.length; i++) {
      console.log(wps.value[i].waypoint);
      if (wps.value[i].waypoint !== null) {
        data.push(wps.value[i].waypoint);
      }
    }
    console.log(data);

    this.routeDirection = new RouteDirection(this.routeForm.controls.origin.value.location,
      this.routeForm.controls.destination.value.location, data);

    if (!this.routeDirection.origin) {
      console.log('please enter a start location to complete the route');
    } else if (!this.routeDirection.destination) {
      console.log('please enter a destination to complete the route');
    } else {
      this.completeRoute = true;
    }
    console.log(this.routeDirection);
  }

  clearRoute() {
    this.completeRoute = !this.completeRoute;

    const wps = <FormArray>this.routeForm.controls.waypoints;

    this.routeDirection = null;
    this.routeForm.controls.origin.value.name = null;
    this.routeForm.controls.origin.value.location = null;
    this.routeForm.controls.destination.value.name = null;
    this.routeForm.controls.destination.value.location = null;

    for (let i = 0; i < wps.length; i++) {
      /*wps.value[i].name = null;
      wps.value[i].waypoint = null;*/
      console.log(i);
      console.log(wps.length);
      this.removeWaypoint(i);
      console.log(this.routeForm.controls.waypoints);
    }

    console.log(this.routeForm);
    console.log(this.routeDirection);
    console.log(this.completeRoute);
  }

  private setFormValue(place: PlaceResult, control: AbstractControl, id: string) {
    console.log(control);
    let data;
    let wpControl;
    if (control instanceof FormGroup) {
      data = {
        name: place.formatted_address,
        location: new RouteLocation(place.geometry.location.lat(), place.geometry.location.lng())
      };
      control.setValue(data);
    } else if (control instanceof FormArray) {
      const splits = id.split('.');
      wpControl = control.controls[splits[1]];
      data = {
        name: place.formatted_address,
        waypoint: new RouteWaypoint(new RouteLocation(place.geometry.location.lat(), place.geometry.location.lng()), true)
      };
      wpControl.setValue(data);
    }
  }
}
