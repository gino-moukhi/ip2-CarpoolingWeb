import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {LoginUser} from '../../models/user/login-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  invalidLogin = false;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const credentials = this.loginForm.value;
    if (credentials.email && credentials.password) {
      const loginUser = new LoginUser('', credentials.email, credentials.password, '');
      console.log(credentials);
      console.log(loginUser);
      this.authService.login(loginUser).subscribe(user => {
          console.log('RECEIVED LOGIN VALUE');
          console.log(user);
          sessionStorage.setItem('loginUser', JSON.stringify(user));
          sessionStorage.setItem('guestUser', 'false');
          this.router.navigateByUrl('/main');
        },
        error => {
          console.log(error.error.message);
          this.errorMessage = error.error.message;
          this.invalidLogin = true;
        });
    }
  }
}
