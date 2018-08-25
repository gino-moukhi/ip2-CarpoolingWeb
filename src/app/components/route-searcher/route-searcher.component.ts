import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RouteComplete} from '../../models/route/route-complete';
import {SearchCriteria} from '../../models/searching/search-criteria';
import {RouteLocation} from '../../models/route/route-location';
import {SearchCriteriaAcceptanceType} from '../../models/searching/search-criteria-acceptance-type.enum';
import PlaceResult = google.maps.places.PlaceResult;
import {RouteService} from '../../services/route.service';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-route-searcher',
  templateUrl: './route-searcher.component.html',
  styleUrls: ['./route-searcher.component.css']
})
export class RouteSearcherComponent implements OnInit {
  @Output() routesChanged: EventEmitter<RouteComplete[]> = new EventEmitter<RouteComplete[]>();
  @Output() currentChildRoute: EventEmitter<RouteComplete> = new EventEmitter<RouteComplete>();
  /*allReceivedRoutes: RouteComplete[];
  currentRoute: RouteComplete;*/
  searchRoutes: RouteComplete[];
  simpleSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  advancedSearch = false;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private routeService: RouteService) {
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

  onRouteChanged(event) {
    console.log('THE ROUTE CHANGED IN THE SEARCHER');
    console.log(event);
    // this.currentRoute = event;
    this.currentChildRoute.emit(event);
  }

  onRoutesChanged(event) {
    console.log('THE ROUTES HAVE BEEN CHANGED IN THE SEARCHER');
    console.log(event);
    // this.allReceivedRoutes = event;
    this.routesChanged.emit(event);
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
