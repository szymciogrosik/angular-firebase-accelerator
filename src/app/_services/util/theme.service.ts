import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DARK_THEME_CLASS = 'dark-theme';

  private isDarkTheme = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    this.applyTheme(this.isDarkTheme.value);
  }

  public toggleTheme(): void {
    const isDark = !this.isDarkTheme.value;
    this.isDarkTheme.next(isDark);
    localStorage.setItem(this.THEME_KEY, JSON.stringify(isDark));
    this.applyTheme(isDark);
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    // Default to light theme if no preference is saved, or check OS preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add(this.DARK_THEME_CLASS);
    } else {
      document.body.classList.remove(this.DARK_THEME_CLASS);
    }
  }
}
