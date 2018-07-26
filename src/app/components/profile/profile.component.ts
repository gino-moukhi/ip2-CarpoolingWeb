import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  @Input() public receivedUser: User;
  @Output() userChanged: EventEmitter<User> = new EventEmitter<User>();

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
    this.currentUser = this.receivedUser;
    console.log(this.currentUser);
    console.log(this.receivedUser);

    this.profileForm = this.formBuilder.group({
      email: [this.currentUser.email, Validators.required],
      password: [this.currentUser.password, Validators.required],
      firstName: [this.currentUser.name.firstName, Validators.required],
      lastName: [this.currentUser.name.lastName, Validators.required],
      streetName: [this.currentUser.address.street, Validators.required],
      streetNumber: [this.currentUser.address.streetNumber, Validators.required],
      zipCode: [this.currentUser.address.zipCode, Validators.required],
      city: [this.currentUser.address.city, Validators.required],
      age: [this.currentUser.age, Validators.required],
      gender: [this.currentUser.gender, Validators.required],
      smoker: [this.currentUser.smoker, Validators.required],
      brand: [this.currentUser.vehicle.brand, Validators.required],
      type: [this.currentUser.vehicle.type, Validators.required],
      fuel: [this.currentUser.vehicle.fuelConsumption, Validators.required],
      passengers: [this.currentUser.vehicle.numberOfPassengers, Validators.required]
    });
    console.log(this.profileForm.controls['type'].value);
    console.log(this.currentUser.vehicle.type);
    this.profileForm.get('type').disable();
  }

  onUserChanged() {
    this.userChanged.emit(this.currentUser);
  }

  changeUser() {
    if (this.profileForm.valid) {
      this.currentUser = this.fillUserFromForm();
      console.log(this.currentUser);
      this.userService.updateUser(this.currentUser).subscribe(
        data => {
          this.receivedUser = data;
          this.message = 'Your details were updated successfully';
          this.onUserChanged();
          this.isReading = true;
          this.profileForm.get('type').disable();
        },
        error => this.message = 'Oeps something went wrong while updating your details. Try again later!'
      );
    }
  }

  enableEditing() {
    if (!this.isReading) {
      console.log('resetting values');
      this.currentUser = this.receivedUser;
      this.profileForm.controls['email'].setValue(this.currentUser.email);
      this.profileForm.controls['password'].setValue(this.currentUser.password);
      this.profileForm.controls['firstName'].setValue(this.currentUser.name.firstName);
      this.profileForm.controls['lastName'].setValue(this.currentUser.name.lastName);
      this.profileForm.controls['streetName'].setValue(this.currentUser.address.street);
      this.profileForm.controls['streetNumber'].setValue(this.currentUser.address.streetNumber);
      this.profileForm.controls['zipCode'].setValue(this.currentUser.address.zipCode);
      this.profileForm.controls['city'].setValue(this.currentUser.address.city);
      this.profileForm.controls['age'].setValue(this.currentUser.age);
      this.profileForm.controls['gender'].setValue(this.currentUser.gender);
      this.profileForm.controls['smoker'].setValue(this.currentUser.smoker);
      this.profileForm.controls['brand'].setValue(this.currentUser.vehicle.brand);
      this.profileForm.controls['type'].setValue(this.currentUser.vehicle.type);
      this.profileForm.controls['fuel'].setValue(this.currentUser.vehicle.fuelConsumption);
      this.profileForm.controls['passengers'].setValue(this.currentUser.vehicle.numberOfPassengers);
    }
    this.isReading = !this.isReading;
    if (this.profileForm.get('type').disabled) {
      this.profileForm.get('type').enable();
    } else {
      this.profileForm.get('type').disable();
    }
  }

  private fillUserFromForm() {
    const newUser: User = new User();
    newUser.name = new Name();
    newUser.address = new Address();
    newUser.vehicle = new Vehicle();
    newUser.id = this.receivedUser.id;
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
    newUser.vehicle.numberOfPassengers = this.profileForm.controls['passengers'].value;
    return newUser;
  }
}
