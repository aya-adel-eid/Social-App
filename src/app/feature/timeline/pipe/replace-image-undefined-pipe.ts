import { Pipe, PipeTransform } from '@angular/core';
import { Comments2 } from '../interfaces/IAllPosts';
import { trace } from 'console';

@Pipe({
  name: 'replaceImage',
})
export class ReplaceImageUndefinedPipe implements PipeTransform {
  transform(photo: string | null | undefined): string {
    if (!photo || photo.includes('undefined')) {
      return '/images/profile.png';
    }
    return photo;
  }
}
