import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SuggestionsService } from '../../services/suggestions.service';
import { Suggestion } from '../../interfaces/IALLSuggestions';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { SuggestionCardComponent } from '../../components/suggestion-card/suggestion-card.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-suggestion-page',
  imports: [SuggestionCardComponent],
  templateUrl: './suggestion-page.component.html',
  styleUrl: './suggestion-page.component.css',
})
export class SuggestionPageComponent implements OnInit {
  private readonly suggestionsServices = inject(SuggestionsService);
  allFollowers = signal<Suggestion[]>([]);
  private readonly plat_Id = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_Id)) {
      this.getAllUsers();
    }
  }
  limit = signal<number>(6);

  loadMoreSuggestions() {
    this.limit.update((l) => l + 6);
    this.getAllUsers(this.limit());
  }
  getAllUsers(limit?: number) {
    this.suggestionsServices.getAllUsersSuggestions(limit).subscribe({
      next: (resp) => {
        this.suggestionsServices.isLoading.set(false);
        this.allFollowers.set(resp.data.suggestions);
      },
      error: (error: HttpErrorResponse) => {
        this.suggestionsServices.isLoading.set(false);
      },
    });
  }
}
