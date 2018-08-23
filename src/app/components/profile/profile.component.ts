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
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        },
        error => this.message = 'Oops something went wrong while updating your details. Try again later!'
      );
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
    /*newUser.id = this.currentUser.id;
    newUser.email = this.profileForm.controls['email'].value;
    newUser.password = this.profileForm.controls['password'].value;
    newUser.name.firstName = this.profileForm.controls['firstName'].value;
    newUser.name.lastName = this.profileForm.controls['lastName'].value;
    newUser.address.street = this.profileForm.controls['streetName'].value;
    newUser.address.streetNumber = this.profileForm.controls['streetNumber'].value;
    newUser.address.zipCode = this.profileForm.controls['zipCode'].value;
    newUser.address.city = this.profileForm.controls['city'].value;
    newUser.age = this.profileForm.controls['age'].value;
    newUser.gender = this.profileForm.controls['gender'].value;
    newUser.smoker = this.profileForm.controls['smoker'].value;
    newUser.vehicle.brand = this.profileForm.controls['brand'].value;
    newUser.vehicle.type = this.profileForm.controls['type'].value;
    newUser.vehicle.fuelConsumption = this.profileForm.controls['fuel'].value;
    newUser.vehicle.numberOfPassengers = this.profileForm.controls['passengers'].value;*/
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

  log(event) {
    console.log(event);
  }
}
