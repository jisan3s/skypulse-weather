import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { Details } from './details';
import { WeatherFacade } from '../../../../core/store/weather-facade';
import { mockWeatherResponse } from '../../../../testing/weather-test-data';

describe('Details', () => {
    let component: Details;
    let fixture: ComponentFixture<Details>;
    let facade: {
        connect: ReturnType<typeof vi.fn>;
        disconnect: ReturnType<typeof vi.fn>;
        weather$: BehaviorSubject<any>;
        loading$: BehaviorSubject<boolean>;
    };

    beforeEach(async () => {
        facade = {
            connect: vi.fn(),
            disconnect: vi.fn(),
            weather$: new BehaviorSubject(mockWeatherResponse),
            loading$: new BehaviorSubject(false)
        };

        await TestBed.configureTestingModule({
            imports: [Details],
            providers: [
                { provide: WeatherFacade, useValue: facade as unknown as WeatherFacade }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(Details);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render current-condition detail cards', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        expect(facade.connect).toHaveBeenCalled();
        expect(compiled.textContent).toContain('Current Conditions');
        expect(compiled.textContent).toContain('Humidity');
        expect(compiled.textContent).toContain('27');
    });
});
