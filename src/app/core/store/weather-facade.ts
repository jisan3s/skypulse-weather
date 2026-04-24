import { Injectable, NgZone } from '@angular/core';
import { GeoSearchResult, WeatherApiResponse, WeatherCacheEntry } from '../models/weather';
import { Location } from '../services/location';
import { Weather } from '../services/weather';
import { WeatherStore } from './weather-store';

@Injectable({
    providedIn: 'root',
})
export class WeatherFacade {

    private lat = 40.7;
    private lon = -74;
    private activeConsumers = 0;
    private initialized = false;

    private refreshInterval: ReturnType<typeof setInterval> | null = null;
    private readonly refreshTime = 300000;
    private readonly cacheDuration = 300000;
    private readonly weatherCache = new Map<string, WeatherApiResponse>();
    private readonly cachePrefix = 'weather-cache:';
    private readonly maxCacheEntries = 8;

    constructor(
        private weather: Weather,
        private location: Location,
        private store: WeatherStore,
        private ngZone: NgZone
    ) {}

    get weather$() {
        return this.store.weather$;
    }

    get location$() {
        return this.store.location$;
    }

    get loading$() {
        return this.store.loading$;
    }

    get error$() {
        return this.store.error$;
    }

    get lastUpdated$() {
        return this.store.lastUpdated$;
    }

    connect(): void {
        this.activeConsumers += 1;

        if (!this.initialized) {
            this.initialized = true;
            this.store.setLocation(this.lat, this.lon);
            this.getUserLocation();
        }

        if (!this.refreshInterval) {
            this.startAutoRefresh();
        }
    }

    disconnect(): void {
        this.activeConsumers = Math.max(0, this.activeConsumers - 1);

        if (this.activeConsumers === 0) {
            this.stopAutoRefresh();
        }
    }

    searchCity(city: string): void {
        const normalizedCity = city.trim();

        if (!normalizedCity) {
            return;
        }

        this.setLoadingState(true);
        this.store.setError(null);

        this.location.searchCity(normalizedCity)
        .subscribe({
            next: (res) => {
                this.runInZone(() => {
                    const result = res?.results?.[0];

                    if (!result) {
                        this.store.setError(`No location found for "${normalizedCity}".`);
                        this.setLoadingState(false);
                        return;
                    }

                    this.applySearchResult(result);
                    this.loadWeather();
                });
            },
            error: () => {
                this.runInZone(() => {
                    this.store.setError('Unable to search for that city right now.');
                    this.setLoadingState(false);
                });
            }
        });
    }

    refreshWeather(): void {
        this.loadWeather();
    }

    private getUserLocation(): void {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            this.loadWeather();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.ngZone.run(() => {
                    this.setCoordinates(position.coords.latitude, position.coords.longitude);
                    this.store.setError(null);
                    this.loadWeather();
                });
            },
            () => {
                this.ngZone.run(() => {
                    this.store.setError('Location permission denied. Showing the default city.');
                    this.loadWeather();
                });
            }
        );
    }

    private loadWeather(): void {
        this.setLoadingState(true);
        this.store.setError(null);

        const key = this.getCacheKey(this.lat, this.lon);

        const memoryCache = this.weatherCache.get(key);

        if (memoryCache) {
            this.setWeatherData(memoryCache);
            this.setLoadingState(false);
            return;
        }

        const cached = this.getStoredCache(key);

        if (cached) {
            this.setMemoryCache(key, cached.data);
            this.setWeatherData(cached.data);
            this.setLoadingState(false);
            return;
        }

        this.weather.getWeather(this.lat, this.lon)
        .subscribe({
            next: (res) => {
                this.runInZone(() => {
                    this.setMemoryCache(key, res);
                    this.persistCache(key, {
                        data: res,
                        timestamp: Date.now()
                    });
                    this.setWeatherData(res);
                    this.setLoadingState(false);
                });
            },
            error: () => {
                this.runInZone(() => {
                    this.store.setError('Unable to load the latest weather data.');
                    this.setLoadingState(false);
                });
            }
        });
    }

    private applySearchResult(result: GeoSearchResult): void {
        this.setCoordinates(result.latitude, result.longitude);
    }

    private setCoordinates(lat: number, lon: number): void {
        this.lat = lat;
        this.lon = lon;
        this.store.setLocation(lat, lon);
    }

    private setWeatherData(data: WeatherApiResponse): void {
        this.store.setWeather(data);
        this.store.setLocation(this.lat, this.lon);
    }

    private setLoadingState(status: boolean): void {
        this.store.setLoading(status);
    }

    private startAutoRefresh(): void {
        this.stopAutoRefresh();

        this.refreshInterval = setInterval(() => {
            this.loadWeather();
        }, this.refreshTime);
    }

    private stopAutoRefresh(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    private getCacheKey(lat: number, lon: number): string {
        return `${lat.toFixed(3)}_${lon.toFixed(3)}`;
    }

    private setMemoryCache(key: string, data: WeatherApiResponse): void {
        this.weatherCache.set(key, data);

        if (this.weatherCache.size <= this.maxCacheEntries) {
            return;
        }

        const oldestKey = this.weatherCache.keys().next().value;

        if (oldestKey) {
            this.weatherCache.delete(oldestKey);
        }
    }

    private persistCache(key: string, entry: WeatherCacheEntry): void {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(this.getStorageKey(key), JSON.stringify(entry));
        this.cleanupStoredCache();
    }

    private getStoredCache(key: string): WeatherCacheEntry | null {
        if (typeof window === 'undefined') {
            return null;
        }

        const raw = localStorage.getItem(this.getStorageKey(key));

        if (!raw) {
            return null;
        }

        try {
            const parsed = JSON.parse(raw) as WeatherCacheEntry;
            const isValid = Date.now() - parsed.timestamp < this.cacheDuration;

            if (!isValid) {
                localStorage.removeItem(this.getStorageKey(key));
                return null;
            }

            return parsed;
        } catch {
            localStorage.removeItem(this.getStorageKey(key));
            return null;
        }
    }

    private cleanupStoredCache(): void {
        if (typeof window === 'undefined') {
            return;
        }

        const cacheKeys: Array<{ key: string, timestamp: number }> = [];

        for (const storageKey of Object.keys(localStorage)) {
            if (!storageKey.startsWith(this.cachePrefix)) {
                continue;
            }

            const raw = localStorage.getItem(storageKey);

            if (!raw) {
                continue;
            }

            try {
                const parsed = JSON.parse(raw) as WeatherCacheEntry;

                if (Date.now() - parsed.timestamp >= this.cacheDuration) {
                    localStorage.removeItem(storageKey);
                    continue;
                }

                cacheKeys.push({ key: storageKey, timestamp: parsed.timestamp });
            } catch {
                localStorage.removeItem(storageKey);
            }
        }

        cacheKeys
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, Math.max(0, cacheKeys.length - this.maxCacheEntries))
        .forEach(({ key }) => {
            localStorage.removeItem(key);
        });
    }

    private getStorageKey(key: string): string {
        return `${this.cachePrefix}${key}`;
    }

    private runInZone(task: () => void): void {
        this.ngZone.run(task);
    }

}
