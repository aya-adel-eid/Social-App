import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkService {
  isDark: boolean = false;
  // constructor() {
  //   this.SaveFinal();
  // }
  SaveFinal() {
    const saved = localStorage.getItem('isDark');

    if (saved !== null) {
      this.isDark = JSON.parse(saved);
      this.btnToggle();
    }
  }
  toggleMode() {
    this.isDark = !this.isDark;
    this.btnToggle();
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
  }
  btnToggle(): void {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
