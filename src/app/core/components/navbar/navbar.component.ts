import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../feature/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { sign } from 'crypto';
import { DarkService } from '../../services/dark.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authServices = inject(AuthService);
  private readonly darkServices = inject(DarkService);
  private readonly platID = inject(PLATFORM_ID);
  userInfo = this.authServices.userData;
  openMenu = signal<boolean>(false);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platID)) {
      this.authServices.getUserData();
      this.darkServices.SaveFinal();
    }
  }
  logOuT() {
    this.authServices.logOut();
  }
  toggle() {
    this.openMenu.set(!this.openMenu());
  }
  toggleDark() {
    this.darkServices.toggleMode();
  }
}
