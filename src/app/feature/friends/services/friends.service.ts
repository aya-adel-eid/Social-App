import { Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { IFriends } from '../interfaces/IFriends';

@Injectable({
  providedIn: 'root',
})
export class FriendsService extends BaseHttpServices {
  isLoading = signal<boolean>(true);
  getFriends(idUser: string) {
    return this.httpClient.get<IFriends>(`${APP_APIS.AUTH.users}/${idUser}/profile`);
  }
}
