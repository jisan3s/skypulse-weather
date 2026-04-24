import { TestBed } from '@angular/core/testing';

import { WeatherStore } from './weather-store';
import { mockWeatherResponse } from '../../testing/weather-test-data';

describe('WeatherStore', () => {
    let service: WeatherStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WeatherStore);
    });

    it('should store weather data and track the last update time', () => {
        let weatherValue = null;
        let lastUpdatedValue = null;

        service.weather$.subscribe((value) => {
            weatherValue = value;
        });

        service.lastUpdated$.subscribe((value) => {
            lastUpdatedValue = value;
        });

        service.setWeather(mockWeatherResponse);

        expect(weatherValue).toEqual(mockWeatherResponse);
        expect(lastUpdatedValue).toBeInstanceOf(Date);
    });

    it('should store and clear user-facing errors', () => {
        let errorValue: string | null = null;

        service.error$.subscribe((value) => {
            errorValue = value;
        });

        service.setError('Unable to load weather');
        expect(errorValue).toBe('Unable to load weather');

        service.setError(null);
        expect(errorValue).toBeNull();
    });
});
