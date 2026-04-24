import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoSearchResponse } from '../models/weather';

@Injectable({
    providedIn: 'root',
})
export class Location {

    constructor(
        private http: HttpClient
    ) {}

    // 🌍 City → Coordinates
    searchCity(city: string) {
        return this.http.get<GeoSearchResponse>(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
    }

    // 📍 Coordinates → City
    searchCityByCoords(lat: number, lon: number) {
        return this.http.get<GeoSearchResponse>(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
        );
    }

}
