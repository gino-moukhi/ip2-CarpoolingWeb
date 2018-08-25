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
import {RouteUser} from '../../models/route/route-user';
import {ControlPosition, MapTypeControlStyle} from '@agm/core/services/google-maps-types';
import {RouteType} from '../../models/route/route-type.enum';

declare var google: any;

@Component({
  selector: 'app-carpool-map',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {
  home: RouteLocation;
  isCompleteRoute = false;
  routeToSend: RouteComplete;
  currentMapInstance: google.maps.Map;
  routeForm: FormGroup;
  trafficLayer: google.maps.TrafficLayer;
  routeDefinition: RouteDefinition;
  currentUser: User;
  routeVisible = false;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService) {
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
      waypoints: this.fb.array([this.initWaypointFields()]),
      departure: new FormControl(Validators.required)
    });

    this.home = new RouteLocation('', 0, 0);

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.currentUser);
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
        this.home = new RouteLocation('', position.coords.latitude, position.coords.longitude);
      });
    }
  }

  swapTrafficLayer() {
    if (this.trafficLayer.getMap() == null) {
      this.trafficLayer.setMap(this.currentMapInstance);
    } else {
      this.trafficLayer.setMap(null);
    }
  }

  onMapReady(mapInstance) {
    const controlDiv = document.createElement('div');
    this.trafficControl(controlDiv);
    mapInstance.controls[ControlPosition.TOP_CENTER].push(controlDiv);
    mapInstance.mapTypeControl = true;
    mapInstance.fullscreenControl = true;
    mapInstance.mapTypeControlOptions = {
      style: MapTypeControlStyle.HORIZONTAL_BAR,
      mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid']
    };
    this.currentMapInstance = mapInstance;
    this.setCurrentPosition();
    this.trafficLayer = new google.maps.TrafficLayer();
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
    console.log('complete');
    console.log(completeWaypoints);
    console.log('as location');
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
      this.isCompleteRoute = true;
      this.routeVisible = true;
    }

    console.log(this.routeDefinition);
    if (this.isCompleteRoute) {
      const routeDefinitionForBackEnd = new RouteDefinition(this.routeDefinition.origin, this.routeDefinition.destination,
        this.routeForm.controls.routeType.value, waypointsAsLocation);

      console.log(routeDefinitionForBackEnd);
      let departure: Date;
      console.log(this.routeForm.controls.departure.value.toString());
      if (this.routeForm.controls.departure.value.toString().includes('function (control)')) {
        console.log('BAD VALUE');
        departure = new Date();
        console.log(departure);
      } else {
        console.log('GOOD VALUE');
        departure = new Date(this.routeForm.controls.departure.value);
        console.log(departure);
      }
      const currentRouteUser = new RouteUser(this.currentUser);
      this.routeToSend = new RouteComplete(null, routeDefinitionForBackEnd, currentRouteUser.vehicle.type,
        departure, this.currentUser.vehicle.numberOfPassengers, currentRouteUser, [], []);
      console.log(this.routeToSend);
    }
  }

  sendRoute() {
    this.routeService.createRoute(this.routeToSend).subscribe();
  }
  // TODO fix clear route in map
  clearRoute() {
    this.isCompleteRoute = false;
    this.routeVisible = false;
    const wps = <FormArray>this.routeForm.controls.waypoints;
    console.log('WP ARRAY SIZE');
    console.log(wps.length);
    while (wps.length !== 1) {
      this.removeWaypoint(wps.length - 1);
    }
    this.routeDefinition = new RouteDefinition(this.home, this.home, RouteType.SINGLE, []);
    this.routeToSend = null;

    this.routeForm.reset();


    console.log('FORM');
    console.log(this.routeForm);
    console.log('DEFINITION');
    console.log(this.routeDefinition);
    console.log('ROUTE TO SEND');
    console.log(this.routeToSend);
    console.log('ISCOMPLETE');
    console.log(this.isCompleteRoute);
  }

  swapLocations() {
    const tempOrigin = {
      name: this.routeForm.controls.origin.value.name,
      location: this.routeForm.controls.origin.value.location
    };
    const tempDestination = {
      name: this.routeForm.controls.destination.value.name,
      location: this.routeForm.controls.destination.value.location
    };
    this.routeForm.controls.origin.reset();
    this.routeForm.controls.destination.reset();
    this.routeForm.controls.origin.setValue(tempDestination);
    this.routeForm.controls.destination.setValue(tempOrigin);
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

  private trafficControl(controlDiv) {
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to show traffic';
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '11px';
    controlText.style.lineHeight = '26px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show traffic';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', () => {
      if (controlUI.children[0].innerHTML === 'Show traffic') {
        controlUI.children[0].innerHTML = 'Hide traffic';
      } else {
        controlUI.children[0].innerHTML = 'Show traffic';
      }
      this.swapTrafficLayer();
    });
    controlUI.addEventListener('mouseover', () => {
      controlUI.style.backgroundColor = '#d9d9d9';
      controlUI.style.borderColor = '#d9d9d9';
    });
    controlUI.addEventListener('mouseout', () => {
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.borderColor = '#fff';
    });
  }
}
