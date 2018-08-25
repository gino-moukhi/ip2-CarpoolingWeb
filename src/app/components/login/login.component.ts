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
        console.log('user is logged in');
        sessionStorage.setItem('loginUser', JSON.stringify(user));
        this.router.navigateByUrl('/main');
      });
    }
  }
}
