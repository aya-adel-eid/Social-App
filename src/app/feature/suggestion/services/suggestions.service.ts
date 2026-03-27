import { Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { IAllSuggestions } from '../interfaces/IALLSuggestions';

@Injectable({
  providedIn: 'root',
})
export class SuggestionsService extends BaseHttpServices {
  isLoading = signal<boolean>(true);
  getAllUsersSuggestions(limit = 6) {
    return this.httpClient.get<IAllSuggestions>(
      `${APP_APIS.AUTH.users}/suggestions?limit=${limit}`,
    );
  }
}
