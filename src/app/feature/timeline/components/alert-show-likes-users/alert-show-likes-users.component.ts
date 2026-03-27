import { Component, inject } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-alert-show-likes-users',
  imports: [MatCard, MatCardHeader, MatCardContent],
  templateUrl: './alert-show-likes-users.component.html',
  styleUrl: './alert-show-likes-users.component.css',
})
export class AlertShowLikesUsersComponent {
  private readonly dialog = inject(MatDialog);
  private readonly timeLineServices = inject(TimelineService);
  allLikes = this.timeLineServices.allPostLikes;
  closeDialog() {
    this.dialog.closeAll();
    this.timeLineServices.allPostLikes.set([]);
  }
}
