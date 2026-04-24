import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { Forecast } from './forecast';
import { WeatherFacade } from '../../../../core/store/weather-facade';
import { mockWeatherResponse } from '../../../../testing/weather-test-data';

describe('Forecast', () => {
    let component: Forecast;
    let fixture: ComponentFixture<Forecast>;
    let facade: {
        connect: ReturnType<typeof vi.fn>;
        disconnect: ReturnType<typeof vi.fn>;
        weather$: BehaviorSubject<any>;
        location$: BehaviorSubject<any>;
        loading$: BehaviorSubject<boolean>;
    };

    beforeEach(async () => {
        facade = {
            connect: vi.fn(),
            disconnect: vi.fn(),
            weather$: new BehaviorSubject(mockWeatherResponse),
            location$: new BehaviorSubject({ lat: 23.8, lon: 90.4 }),
            loading$: new BehaviorSubject(false)
        };

        await TestBed.configureTestingModule({
            imports: [Forecast],
            providers: [
                { provide: WeatherFacade, useValue: facade as unknown as WeatherFacade }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(Forecast);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render hourly forecast cards', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        expect(facade.connect).toHaveBeenCalled();
        expect(compiled.textContent).toContain('Upcoming Hours');
        expect(compiled.textContent).toContain('Humidity 64%');
    });
});
