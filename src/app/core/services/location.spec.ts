import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Location } from './location';

describe('Location', () => {
    let service: Location;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(Location);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should request coordinates for a city search', () => {
        service.searchCity('Dhaka').subscribe();

        const request = httpMock.expectOne('https://geocoding-api.open-meteo.com/v1/search?name=Dhaka&count=1');

        expect(request.request.method).toBe('GET');
        request.flush({ results: [] });
    });
});
