import {Component, Input, NgZone, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {RouteLocation} from '../../models/route/route-location';
import PlaceResult = google.maps.places.PlaceResult;
import {CommunicationRequest} from '../../models/communication/communication-request';
import {CommunicationRequestStatus} from '../../models/communication/communication-request-status.enum';
import {CommunicationService} from '../../services/communication.service';
import {RouteUser} from '../../models/route/route-user';

@Component({
  selector: 'app-communication-form',
  templateUrl: './communication-form.component.html',
  styleUrls: ['./communication-form.component.css']
})
export class CommunicationFormComponent implements OnInit {
  @Input() currentRouteId: string;
  @Input() currentUser: RouteUser;
  communicationForm: FormGroup;
  communicationRequest: CommunicationRequest;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
              private communicationService: CommunicationService) {
  }

  ngOnInit() {
    this.communicationForm = this.fb.group({
      origin: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      destination: new FormGroup({
        name: new FormControl(),
        location: new FormControl()
      }),
      comment: new FormControl()
    });
  }

  sendRequest() {
    const origin = new RouteLocation(this.communicationForm.controls.origin.value.name,
      this.communicationForm.controls.origin.value.location.lat, this.communicationForm.controls.origin.value.location.lng);
    const destination = new RouteLocation(this.communicationForm.controls.destination.value.name,
      this.communicationForm.controls.destination.value.location.lat, this.communicationForm.controls.destination.value.location.lng);
    this.communicationRequest = new CommunicationRequest('', this.currentRouteId, this.currentUser, origin, destination,
      this.communicationForm.controls.comment.value, CommunicationRequestStatus.IN_PROGRESS);

    console.log(this.communicationRequest);
    this.communicationService.sendCommunicationRequest(this.communicationRequest).subscribe();
  }

  clearForm() {
    this.communicationForm.reset();
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
            const control = this.communicationForm.controls.origin;
            this.setFormValue(place, control);

          } else if (event.target.id === 'destination') {
            const control = this.communicationForm.controls.destination;
            this.setFormValue(place, control);
          }
        });
      });
    });
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
