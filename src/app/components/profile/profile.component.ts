import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user/user';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';
import {UserService} from '../../services/user.service';
import {VehicleType} from '../../models/user/vehicle-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() isIncompleteProfile: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fieldsToUpdate: EventEmitter<string[]> = new EventEmitter<string[]>();
  profileForm: FormGroup;
  currentUser: User;
  isReading = true;
  message: string;
  types = VehicleType;
  keys: string[];

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.keys = Object.keys(this.types).filter(String);
  }

  ngOnInit() {
    this.currentUser = new User();
    this.currentUser.name = new Name();
    this.currentUser.address = new Address();
    this.currentUser.vehicle = new Vehicle();
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.currentUser);

    this.profileForm = this.formBuilder.group({
      email: [this.currentUser.email, Validators.required],
      password: [this.currentUser.password, Validators.required],
      name: new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl()
      }),
      age: [this.currentUser.age, Validators.required],
      gender: [this.currentUser.gender, Validators.required],
      smoker: [this.currentUser.smoker, Validators.required],
      address: new FormGroup({
        street: new FormControl(),
        streetNumber: new FormControl(),
        zipCode: new FormControl(),
        city: new FormControl()
      }),
      vehicle: new FormGroup({
        brand: new FormControl(),
        type: new FormControl(),
        fuelConsumption: new FormControl(),
        numberOfPassengers: new FormControl(),
      }),
    });
    this.profileForm.controls.name.setValue({
      firstName: this.currentUser.name.firstName,
      lastName: this.currentUser.name.lastName
    });
    this.profileForm.controls.address.setValue({
      street: this.currentUser.address.street,
      streetNumber: this.currentUser.address.streetNumber,
      zipCode: this.currentUser.address.zipCode,
      city: this.currentUser.address.city,
    });
    this.profileForm.controls.vehicle.setValue({
      brand: this.currentUser.vehicle.brand,
      type: this.currentUser.vehicle.type,
      fuelConsumption: this.currentUser.vehicle.fuelConsumption,
      numberOfPassengers: this.currentUser.vehicle.numberOfPassengers
    });
    this.profileForm.disable();
  }

  updateUser() {
    if (this.profileForm.valid) {
      this.currentUser = this.fillUserFromForm();
      console.log('CURRENT USER');
      console.log(this.currentUser);
      this.userService.updateUser(this.currentUser).subscribe(
        data => {
          this.currentUser = data;
          this.message = 'Your details were updated successfully';
          this.isReading = true;
          this.profileForm.disable();
          this.determenIfUserHasEmptyFields(this.currentUser);
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        },
        error => {
          this.message = 'Something went wrong while updating your details.';
          console.log(error.error.message);
        }
      );
    } else {
      this.message = 'Form is invalid. (check if gender is chosen)';
    }
  }

  enableEditing() {
    console.log(this.currentUser.smoker);
    console.log(this.profileForm.controls.smoker.value);
    if (!this.isReading) {
      const originalUserWithoutId = {
        email: this.currentUser.email,
        password: this.currentUser.password,
        name: this.currentUser.name,
        age: this.currentUser.age,
        gender: this.currentUser.gender,
        smoker: this.currentUser.smoker,
        address: this.currentUser.address,
        vehicle: this.currentUser.vehicle,
      };
      this.profileForm.setValue(originalUserWithoutId);
    }
    this.isReading = !this.isReading;
    if (this.profileForm.disabled) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  private fillUserFromForm() {
    let newUser: User = new User();
    newUser.name = new Name();
    newUser.address = new Address();
    newUser.vehicle = new Vehicle();
    const dataFromForm = {
      id: this.currentUser.id,
      email: this.profileForm.controls.email.value,
      password: this.profileForm.controls.password.value,
      name: this.profileForm.controls.name.value,
      age: this.profileForm.controls.age.value,
      gender: this.profileForm.controls.gender.value,
      smoker: this.profileForm.controls.smoker.value,
      address: this.profileForm.controls.address.value,
      vehicle: this.profileForm.controls.vehicle.value,
    };
    console.log('DATA');
    console.log(dataFromForm);
    newUser = dataFromForm;
    return newUser;
  }

  private determenIfUserHasEmptyFields(user: User) {
    const emptyFields = [];
    for (const element in user) {
      if (element) {
        for (const el in user[element]) {
          if (element === 'name' || element === 'address' || element === 'vehicle') {
            if (!user[element][el]) {
              emptyFields.push(el);
            }
          }
        }
      }
    }
    if (emptyFields.length !== 0) {
      this.isIncompleteProfile.emit(true);
      this.fieldsToUpdate.emit(emptyFields);
    } else {
      this.isIncompleteProfile.emit(false);
      this.fieldsToUpdate.emit(emptyFields);
    }
  }
}
