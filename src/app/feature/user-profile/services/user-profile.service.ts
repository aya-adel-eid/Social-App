import { Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { IFollow, IUserInfo } from '../interfaces/IUserInfo';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseHttpServices {
  isFollow = signal<boolean>(false);
  getUserProfile(userId: string) {
    return this.httpClient.get<IUserInfo>(`${APP_APIS.AUTH.users}/${userId}/profile`);
  }
  followUser(userId: string) {
    return this.httpClient.put<IFollow>(`${APP_APIS.AUTH.users}/${userId}/follow`, {});
  }
}
