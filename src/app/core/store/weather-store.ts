import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinates, WeatherApiResponse } from '../models/weather';

@Injectable({
    providedIn: 'root',
})
export class WeatherStore {

    private weatherSubject = new BehaviorSubject<WeatherApiResponse | null>(null);
    weather$ = this.weatherSubject.asObservable();

    private locationSubject = new BehaviorSubject<Coordinates | null>(null);
    location$ = this.locationSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    private lastUpdatedSubject = new BehaviorSubject<Date | null>(null);
    lastUpdated$ = this.lastUpdatedSubject.asObservable();

    setWeather(data: WeatherApiResponse): void {
        this.weatherSubject.next(data);
        this.lastUpdatedSubject.next(new Date());
    }

    setLocation(lat: number, lon: number): void {
        this.locationSubject.next({ lat, lon });
    }

    setLoading(status: boolean): void {
        this.loadingSubject.next(status);
    }

    setError(message: string | null): void {
        this.errorSubject.next(message);
    }

}
