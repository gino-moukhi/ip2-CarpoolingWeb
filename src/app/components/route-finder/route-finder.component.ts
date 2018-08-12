import {} from '@types/googlemaps';
import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {RouteComplete} from '../../models/route/route-complete';
import {RouteService} from '../../services/route.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {RouteLocation} from '../../models/route/route-location';
import PlaceResult = google.maps.places.PlaceResult;
import {SearchCriteria} from '../../models/searching/search-criteria';
import {SearchCriteriaAcceptanceType} from '../../models/searching/search-criteria-acceptance-type.enum';

@Component({
  selector: 'app-route-finder',
  templateUrl: './route-finder.component.html',
  styleUrls: ['./route-finder.component.css']
})
export class RouteFinderComponent implements OnInit {
  allRoutes: RouteComplete[];
  allReceivedRoutes: RouteComplete[];
  currentRoute: RouteComplete;
  routesToShow: string;
  myRoutes: RouteComplete[];
  searchRoutes: RouteComplete[];
  simpleSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  advancedSearch = false;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService) {
    this.allRoutes = [];
    this.allReceivedRoutes = [];
  }

  ngOnInit() {
    this.simpleSearchForm = this.fb.group({
      origin: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      destination: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      distance: new FormControl()
    });
    this.advancedSearchForm = this.fb.group({
      minDateTime: new FormControl(),
      maxDateTime: new FormControl(),
      gender: new FormControl(),
      smoker: new FormControl()
    });

    this.routeService.getRoutes().subscribe(value => {
      /*value.forEach(route => {
        const r = new RouteComplete(route.id, route.routeDefinition, route.departure, route.availablePassengers, route.owner,
          route.passengers, route.communicationRequests);
        this.allRoutes.push(r);
      });*/
      this.allRoutes  = value;
      this.allReceivedRoutes  = value;
    });
  }

  log() {
    console.log(this.currentRoute);
  }

  onRouteChanged(event) {
    console.log('THE ROUTE CHANGED IN THE FINDER');
    console.log(event);
    this.currentRoute = event;
  }

  onRoutesChanged(event) {
    console.log('THE ROUTES HAVE BEEN CHANGED IN THE FINDER');
    console.log(event);
    this.allReceivedRoutes = event;
  }

  showSpecificRoutes(type: string) {
    this.routesToShow = type;
    this.currentRoute = null;

    if (this.routesToShow === 'myRoutes') {
      this.routeService.getRoutesOfUser(sessionStorage.getItem('currentUser')).subscribe(value => {
        this.myRoutes = value;
      });
    }
  }

  enableAdvancedForm() {
    this.advancedSearch = !this.advancedSearch;
  }

  swapLocations() {
    const tempOrigin = {
      name: this.simpleSearchForm.controls.origin.value.name,
      location: this.simpleSearchForm.controls.origin.value.location
    };
    const tempDestination = {
      name: this.simpleSearchForm.controls.destination.value.name,
      location: this.simpleSearchForm.controls.destination.value.location
    };
    this.simpleSearchForm.controls.origin.reset();
    this.simpleSearchForm.controls.destination.reset();
    this.simpleSearchForm.controls.origin.setValue(tempDestination);
    this.simpleSearchForm.controls.destination.setValue(tempOrigin);
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
            const control = this.simpleSearchForm.controls.origin;
            this.setFormValue(place, control);

          } else if (event.target.id === 'destination') {
            const control = this.simpleSearchForm.controls.destination;
            this.setFormValue(place, control);

          }
        });
      });
    });
  }

  findRoute() {
    console.log(this.simpleSearchForm.controls.origin);
    console.log(this.simpleSearchForm.controls.destination);
    console.log(this.simpleSearchForm.controls.distance);
    const origin = new RouteLocation(this.simpleSearchForm.controls.origin.value.name,
      this.simpleSearchForm.controls.origin.value.location.lat, this.simpleSearchForm.controls.origin.value.location.lng);
    const destination = new RouteLocation(this.simpleSearchForm.controls.destination.value.name,
      this.simpleSearchForm.controls.destination.value.location.lat, this.simpleSearchForm.controls.destination.value.location.lng);
    const distance = this.simpleSearchForm.controls.distance.value;
    console.log(origin);
    console.log(destination);

    if (!this.advancedSearch) {
      const simpleSearchCriteria = new SearchCriteria(origin, destination, distance, null,
        null, SearchCriteriaAcceptanceType.EITHER, SearchCriteriaAcceptanceType.EITHER);
      this.routeService.getRoutesByLocationsSimple(simpleSearchCriteria).subscribe(value => {
        console.log(value);
        this.searchRoutes = value;
      });
    } else {
      const minDeparture = new Date(this.advancedSearchForm.controls.minDateTime.value);
      const maxDeparture = new Date(this.advancedSearchForm.controls.maxDateTime.value);
      console.log(minDeparture);
      console.log(maxDeparture);

      let genderAcceptanceType;
      let smokerAcceptanceType;
      switch (this.advancedSearchForm.controls.gender.value) {
        case 'OPTION1': {
          genderAcceptanceType = SearchCriteriaAcceptanceType.OPTION1;
          break;
        }
        case 'OPTION2': {
          genderAcceptanceType = SearchCriteriaAcceptanceType.OPTION2;
          break;
        }
        default: {
          genderAcceptanceType = SearchCriteriaAcceptanceType.EITHER;
          break;
        }
      }
      switch (this.advancedSearchForm.controls.smoker.value) {
        case 'OPTION1': {
          smokerAcceptanceType = SearchCriteriaAcceptanceType.OPTION1;
          break;
        }
        case 'OPTION2': {
          smokerAcceptanceType = SearchCriteriaAcceptanceType.OPTION2;
          break;
        }
        default: {
          smokerAcceptanceType = SearchCriteriaAcceptanceType.EITHER;
          break;
        }
      }
      console.log(genderAcceptanceType);
      console.log(smokerAcceptanceType);

      const advancedSearchCriteria = new SearchCriteria(origin, destination, distance, minDeparture,
        maxDeparture, genderAcceptanceType, smokerAcceptanceType);

      this.routeService.getRoutesByLocationsAdvanced(advancedSearchCriteria).subscribe(value => {
        this.searchRoutes = value;
      });
    }
  }

  private setFormValue(place: PlaceResult, control: AbstractControl) {
    console.log(control);
    let data;
    if (control instanceof FormGroup) {
      data = {
        name: place.formatted_address,
        location: new RouteLocation(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng())
      };
      control.setValue(data);
    }
  }
}
