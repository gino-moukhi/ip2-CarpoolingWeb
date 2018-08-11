import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() public allUsers: User[];
  loginForm: FormGroup;
  submitted = false;
  invalidLogin = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.allUsers.forEach(user => {
      if (this.loginForm.controls.email.value === user.email && this.loginForm.controls.password.value === user.password) {
        console.log('USERS ARE THE SAME');
        sessionStorage.setItem('currentUser', user.id);
        this.router.navigate(['main']);
      } else {
        this.invalidLogin = true;
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
