import { Component, inject, input, output, signal } from '@angular/core';
import { Notification } from '../../interfaces/INotification';
import { DatePipe } from '@angular/common';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-card-notification',
  imports: [DatePipe],
  templateUrl: './card-notification.component.html',
  styleUrl: './card-notification.component.css',
})
export class CardNotificationComponent {
  notification = input<Notification>();
  private readonly notificationServices = inject(NotificationsService);
  notificationRead = output<string>();
  mark = signal<boolean>(false);
  markNotificationAsRead(notificationID: string) {
    this.notificationServices.markNotificationAsRead(notificationID).subscribe({
      next: () => {
        this.mark.set(true);
        this.notificationRead.emit(notificationID);
        this.notificationServices.countUnRead.update((count) => (count > 0 ? count - 1 : 0));
      },
    });
  }
}
