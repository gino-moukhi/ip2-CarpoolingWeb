import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  selectedIndex: number;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  switchTab(event) {
    if (event === true) {
      this.selectedIndex = 0;
    }
  }

  guestLogin() {
    sessionStorage.setItem('guestUser', 'true');
    this.router.navigateByUrl('/main');
  }
}
