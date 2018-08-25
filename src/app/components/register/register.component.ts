import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {Name} from '../../models/user/name';
import {Address} from '../../models/user/address';
import {Vehicle} from '../../models/user/vehicle';
import {VehicleType} from '../../models/user/vehicle-type.enum';
import {RegisterUser} from '../../models/user/register-user';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() switchToLogin: EventEmitter<boolean> = new EventEmitter<boolean>();
  registerForm: FormGroup;
  submitted = false;
  invalidRegister = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit() {
    const userToRegister = this.fillUser();
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.invalidRegister = true;
      return;
    } else {
      console.log(userToRegister);
      console.log('AUTHENTICATING REGISTRATION OF USER');
      this.auth.register(userToRegister).subscribe(value => {
        console.log(value);
        this.onRegisteredUser();
      });
    }
  }

  private fillUser() {
    const name = new Name();
    name.firstName = this.registerForm.controls.firstName.value;
    name.lastName = this.registerForm.controls.lastName.value;
    return new RegisterUser('', this.registerForm.controls.email.value, this.registerForm.controls.password.value, name, '');
  }

  onRegisteredUser() {
    this.switchToLogin.emit(true);
  }
}
