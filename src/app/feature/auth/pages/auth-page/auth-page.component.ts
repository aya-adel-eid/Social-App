import { Component } from '@angular/core';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [MatCard, MatCardHeader, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {}
