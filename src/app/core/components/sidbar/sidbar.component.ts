import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { STORED_KEYS } from '../../constance/Stored_Keys';
import { NotificationsService } from '../../../feature/Notification/services/notifications.service';

@Component({
  selector: 'app-sidbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidbar.component.html',
  styleUrl: './sidbar.component.css',
})
export class SidbarComponent implements OnInit {
  private readonly plat_ID = inject(PLATFORM_ID);
  private readonly notificationServices = inject(NotificationsService);
  userId = signal<string>('');
  unreadCount = this.notificationServices.countUnRead;
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_ID)) {
      this.userId.set(localStorage.getItem(STORED_KEYS.userId)!);
      this.notificationServices.getUnRead();
    }
  }
  navArr = computed(() => [
    {
      icon: 'fa-solid fa-bookmark',
      name: 'Saved',
      route: '/SavedPosts',
    },
    {
      icon: 'fa-solid fa-user-group',
      name: 'Friends',
      route: '/Friends',
    },
    {
      icon: 'fa-solid fa-circle-user',
      name: 'Profile',
      route: `/userProfile/${this.userId()}`,
    },
    {
      icon: 'fa-solid fa-bell',
      name: 'Notifications',
      route: '/Notifications',
    },
  ]);
}
