import { Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { INotifications } from '../interfaces/INotification';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends BaseHttpServices {
  countUnRead = signal<number>(0);
  getAllNotifications() {
    return this.httpClient.get<INotifications>(`${environment.baseUrl}notifications`);
  }
  getUnRead() {
    return this.httpClient.get<any>(`${environment.baseUrl}notifications/unread-count`).subscribe({
      next: (resp) => {
        this.countUnRead.set(resp.data.unreadCount);
      },
    });
  }
  markNotificationAsRead(notificationID: string) {
    return this.httpClient.patch(`${environment.baseUrl}notifications/${notificationID}/read`, {});
  }
  markAllAsread() {
    return this.httpClient.patch(`${environment.baseUrl}notifications/read-all`, {});
  }
}
