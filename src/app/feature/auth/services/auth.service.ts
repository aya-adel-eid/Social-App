import { inject, Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { STORED_KEYS } from '../../../core/constance/Stored_Keys';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IUserInfo, User } from '../interfaces/IUserInfo';
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpServices {
  private readonly router = inject(Router);
  userData = signal<User | null>(null);
  // register
  signUp(userData: {}) {
    return this.httpClient.post<any>(APP_APIS.AUTH.signUp, userData);
  }
  // login
  signIn(userData: {}) {
    return this.httpClient.post<any>(APP_APIS.AUTH.signIn, userData);
  }
  logOut() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }
  // change password
  changePassword(userInfo: {}) {
    return this.httpClient.patch<any>(APP_APIS.AUTH.changePassword, userInfo);
  }
  // get userData
  getUserData() {
    return this.httpClient.get<IUserInfo>(APP_APIS.AUTH.userData).subscribe({
      next: (resp) => {
        this.userData.set(resp.user);
      },
    });
  }
  // upload Profile Photo
  changeProfilePhoto(photoProfile: FormData) {
    return this.httpClient.put(APP_APIS.AUTH.changePhotoProfile, photoProfile);
  }
  decodeToken(token: string): boolean | void {
    try {
      jwtDecode(token);
      const id = (jwtDecode(token) as { user: string })?.user;

      localStorage.setItem(STORED_KEYS.userId, id);
      return true;
    } catch {
      this.logOut();
    }
  }
}
