import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Weather } from './weather';

describe('Weather', () => {
    let service: Weather;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(Weather);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should request the forecast endpoint with the expected query params', () => {
        service.getWeather(23.81, 90.41).subscribe();

        const request = httpMock.expectOne(
            'https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&current_weather=true&timezone=auto'
        );

        expect(request.request.method).toBe('GET');
        request.flush({});
    });
});
