import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  get user() {
    return this.authService.user;
  }
  ngOnInit(): void {}

  logOut() {
    this.router.navigateByUrl('/auth');
  }
}
