import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { Following } from '../../interfaces/IFriends';
import { FriendsCardComponent } from '../../components/friends-card/friends-card.component';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-friends-page',
  imports: [FriendsCardComponent, MatCard, MatCardHeader, MatCardContent],
  templateUrl: './friends-page.component.html',
  styleUrl: './friends-page.component.css',
})
export class FriendsPageComponent implements OnInit {
  private readonly friendsServices = inject(FriendsService);
  private readonly plat_ID = inject(PLATFORM_ID);
  allFollowing = signal<Following[]>([]);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_ID)) {
      const id = localStorage.getItem(STORED_KEYS.userId)!;
      this.getAllFriends(id);
    }
  }

  getAllFriends(useriD: string) {
    this.friendsServices.getFriends(useriD).subscribe({
      next: (friend) => {
        this.friendsServices.isLoading.set(false);
        console.log(friend);
        this.allFollowing.set(friend.data.user.following);
      },
    });
  }
}
