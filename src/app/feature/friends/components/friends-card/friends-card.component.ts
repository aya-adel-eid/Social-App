import { Component, inject, input } from '@angular/core';
import { Following } from '../../interfaces/IFriends';
import { FriendsService } from '../../services/friends.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-friends-card',
  imports: [RouterLink],
  templateUrl: './friends-card.component.html',
  styleUrl: './friends-card.component.css',
})
export class FriendsCardComponent {
  private readonly friendsServices = inject(FriendsService);
  loading = this.friendsServices.isLoading;
  friends = input<Following[]>();
}
