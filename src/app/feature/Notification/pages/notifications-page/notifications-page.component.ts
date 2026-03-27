import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Notification } from '../../interfaces/INotification';
import { CardNotificationComponent } from '../../components/card-notification/card-notification.component';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAnchor } from '@angular/material/button';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-notifications-page',
  imports: [CardNotificationComponent, MatAnchor],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css',
})
export class NotificationsPageComponent implements OnInit {
  public readonly notificationsServices = inject(NotificationsService);
  allNotifications = signal<Notification[]>([]);
  isLoading = signal<boolean>(true);
  private readonly plat_ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_ID)) {
      this.getAllNotifications();
      this.notificationsServices.getUnRead();
    }
  }
  getAllNotifications() {
    this.notificationsServices.getAllNotifications().subscribe({
      next: (resp) => {
        this.isLoading.set(false);
        this.allNotifications.set(resp.data.notifications);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
      },
    });
  }
  onNotificationRead(id: string) {
    this.allNotifications.update((notifications) =>
      notifications.map(
        (n) => (n._id === id ? { ...n, isRead: true } : n), // ← غير isRead بس
      ),
    );
  }
  markAllAsRead() {
    this.notificationsServices.markAllAsread().subscribe({
      next: () => {},
    });
  }
}
