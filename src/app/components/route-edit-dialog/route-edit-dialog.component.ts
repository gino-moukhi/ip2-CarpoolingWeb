import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RouteDialogData} from '../../models/route/route-dialog-data';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RouteService} from '../../services/route.service';
import {RouteLocation} from '../../models/route/route-location';
import {MapsAPILoader} from '@agm/core';
import {RouteWaypoint} from '../../models/route/route-waypoint';
import PlaceResult = google.maps.places.PlaceResult;
import {RouteComplete} from '../../models/route/route-complete';

@Component({
  selector: 'app-route-edit-dialog',
  templateUrl: './route-edit-dialog.component.html',
  styleUrls: ['./route-edit-dialog.component.css']
})
export class RouteEditDialogComponent implements OnInit {
  routeForm: FormGroup;
  receivedRoute: RouteComplete;

  constructor(public dialogRef: MatDialogRef<RouteEditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: RouteDialogData,
              private fb: FormBuilder, private routeService: RouteService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    console.log('DATA IN EDIT DIALOG');
    console.log(data);
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
      departure: new FormControl(Validators.required)
    });

    this.routeForm.controls.origin.setValue({
      name: this.data.route.routeDefinition.origin.name,
      location: new RouteLocation(this.data.route.routeDefinition.origin.name, this.data.route.routeDefinition.origin.lat,
        this.data.route.routeDefinition.origin.lng)
    });
    this.routeForm.controls.destination.setValue({
      name: this.data.route.routeDefinition.destination.name,
      location: new RouteLocation(this.data.route.routeDefinition.destination.name, this.data.route.routeDefinition.destination.lat,
        this.data.route.routeDefinition.destination.lng)
    });
    this.routeForm.controls.routeType.setValue(this.data.route.routeDefinition.routeType);
    this.routeForm.controls.departure.setValue(this.data.route.departure);
  }

  updateRoute() {
    console.log(this.routeForm.value);
    const updatedRoute: RouteComplete = new RouteComplete(this.data.route.id, this.data.route.routeDefinition,
      this.data.route.vehicleType, this.data.route.departure, this.data.route.availablePassengers,
      this.data.route.owner, this.data.route.passengers, this.data.route.communicationRequests);

    updatedRoute.routeDefinition.origin = this.routeForm.controls.origin.value.location;
    updatedRoute.routeDefinition.destination = this.routeForm.controls.destination.value.location;
    updatedRoute.routeDefinition.routeType = this.routeForm.controls.routeType.value;
    updatedRoute.departure = this.routeForm.controls.departure.value;

    console.log(updatedRoute);
    this.routeService.updateRoute(updatedRoute).subscribe(value => {
      this.receivedRoute = value;
      console.log(this.receivedRoute);
    });
    this.dialogRef.close();
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

          }
        });
      });
    });
  }

  private setFormValue(place: PlaceResult, control: AbstractControl, id: string) {
    console.log(control);
    let data;
    data = {
      name: place.formatted_address,
      location: new RouteLocation(place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng())
    };
    control.setValue(data);
  }
}
