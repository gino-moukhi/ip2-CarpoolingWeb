import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';
import {VehicleType} from '../../models/user/vehicle-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() registerViewChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  newUser: User;
  registerForm: FormGroup;
  submitted = false;
  invalidRegister = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  onSubmit() {
    this.fillUser();
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.invalidRegister = true;
      return;
    } else {
      console.log(this.newUser);
      console.log('CALLING CREATE USER');
      this.userService.createUser(this.newUser)
        .subscribe(() => {
          this.onRegisterViewChanged();
        });
    }
  }

  onRegisterViewChanged() {
    this.registerViewChanged.emit(true);
  }

  private fillUser() {
    this.newUser = new User();
    this.newUser.name = new Name();
    this.newUser.address = new Address();
    this.newUser.email = this.registerForm.controls['email'].value;
    this.newUser.password = this.registerForm.controls['password'].value;
    this.newUser.name.firstName = this.registerForm.controls['firstName'].value;
    this.newUser.name.lastName = this.registerForm.controls['lastName'].value;
    this.newUser.address.street = this.registerForm.controls['streetName'].value;
    this.newUser.address.streetNumber = this.registerForm.controls['streetNumber'].value;
    this.newUser.address.zipCode = this.registerForm.controls['zipCode'].value;
    this.newUser.address.city = this.registerForm.controls['city'].value;
    this.newUser.age = this.registerForm.controls['age'].value;
    this.newUser.gender = this.registerForm.controls['gender'].value;

    // DEFAULT VALUES TO COMPLETE USER
    this.newUser.vehicle = new Vehicle();
    this.newUser.vehicle.brand = '';
    this.newUser.vehicle.type = VehicleType.SEDAN;
    this.newUser.vehicle.fuelConsumption = 0.0;
    this.newUser.vehicle.numberOfPassengers = 0;
    this.newUser.smoker = false;
  }
}
