import { Component, inject, input, signal } from '@angular/core';
import { Suggestion } from '../../interfaces/IALLSuggestions';
import { UserProfileService } from '../../../user-profile/services/user-profile.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatAnchor } from '@angular/material/button';
import { SuggestionsService } from '../../services/suggestions.service';

@Component({
  selector: 'app-suggestion-card',
  imports: [MatAnchor],
  templateUrl: './suggestion-card.component.html',
  styleUrl: './suggestion-card.component.css',
})
export class SuggestionCardComponent {
  private readonly userInfoServices = inject(UserProfileService);
  private readonly toast = inject(ToastrService);
  private readonly suggestionServices = inject(SuggestionsService);
  isLoading = this.suggestionServices.isLoading;
  isLoad = signal<boolean>(false);
  isFollow = signal<boolean>(false);
  user = input<Suggestion>();
  followUser(userId: string) {
    this.isLoad.set(true);
    this.userInfoServices.followUser(userId).subscribe({
      next: (resp) => {
        this.isLoad.set(false);
        this.isFollow.set(resp.data.following);
        if (resp.data.following) {
          this.toast.success('You started following this user', '', {
            progressBar: true,
          });
        } else {
          this.toast.info('Unfollowed successfully', '', {
            progressBar: true,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoad.set(false);
      },
    });
  }
}
