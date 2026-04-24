import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherApiResponse } from '../models/weather';

@Injectable({
    providedIn: 'root',
})
export class Weather {

    constructor(
        private http: HttpClient
    ) {}

    getWeather(lat: number, lon: number): Observable<WeatherApiResponse> {
        return this.http.get<WeatherApiResponse>(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m` + `&current_weather=true&timezone=auto`
        );
    }

}
