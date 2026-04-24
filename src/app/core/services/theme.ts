import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Theme {

    private readonly storageKey = 'theme';

    initializeTheme(): boolean {
        const isDarkMode = this.getStoredTheme() === 'dark';
        this.applyTheme(isDarkMode);
        return isDarkMode;
    }

    toggleTheme(currentValue: boolean): boolean {
        const nextValue = !currentValue;

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.storageKey, nextValue ? 'dark' : 'light');
        }

        this.applyTheme(nextValue);
        return nextValue;
    }

    private getStoredTheme(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(this.storageKey);
    }

    private applyTheme(isDarkMode: boolean): void {
        if (typeof document === 'undefined') {
            return;
        }

        document.body.classList.toggle('dark-mode', isDarkMode);
    }

}
