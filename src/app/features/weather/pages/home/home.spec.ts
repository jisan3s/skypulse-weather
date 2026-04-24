import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { Home } from './home';
import { Theme } from '../../../../core/services/theme';
import { WeatherFacade } from '../../../../core/store/weather-facade';
import { Coordinates, WeatherApiResponse } from '../../../../core/models/weather';
import { mockWeatherResponse } from '../../../../testing/weather-test-data';

describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;
    let weatherSubject: BehaviorSubject<WeatherApiResponse | null>;
    let loadingSubject: BehaviorSubject<boolean>;
    let errorSubject: BehaviorSubject<string | null>;
    let locationSubject: BehaviorSubject<Coordinates | null>;
    let updatedSubject: BehaviorSubject<Date | null>;
    let facade: {
        connect: ReturnType<typeof vi.fn>;
        disconnect: ReturnType<typeof vi.fn>;
        searchCity: ReturnType<typeof vi.fn>;
        refreshWeather: ReturnType<typeof vi.fn>;
        weather$: BehaviorSubject<WeatherApiResponse | null>;
        loading$: BehaviorSubject<boolean>;
        error$: BehaviorSubject<string | null>;
        location$: BehaviorSubject<Coordinates | null>;
        lastUpdated$: BehaviorSubject<Date | null>;
    };
    let theme: {
        initializeTheme: ReturnType<typeof vi.fn>;
        toggleTheme: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        weatherSubject = new BehaviorSubject<WeatherApiResponse | null>(null);
        loadingSubject = new BehaviorSubject<boolean>(false);
        errorSubject = new BehaviorSubject<string | null>(null);
        locationSubject = new BehaviorSubject<Coordinates | null>({ lat: 40.7, lon: -74 });
        updatedSubject = new BehaviorSubject<Date | null>(null);

        facade = {
            connect: vi.fn(),
            disconnect: vi.fn(),
            searchCity: vi.fn(),
            refreshWeather: vi.fn(),
            weather$: weatherSubject,
            loading$: loadingSubject,
            error$: errorSubject,
            location$: locationSubject,
            lastUpdated$: updatedSubject
        };

        theme = {
            initializeTheme: vi.fn(),
            toggleTheme: vi.fn()
        };
        theme.initializeTheme.mockReturnValue(false);
        theme.toggleTheme.mockReturnValue(true);

        await TestBed.configureTestingModule({
            imports: [Home],
            providers: [
                { provide: WeatherFacade, useValue: facade as unknown as WeatherFacade },
                { provide: Theme, useValue: theme as unknown as Theme }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(Home);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should connect to the facade and build chart data from weather updates', () => {
        weatherSubject.next(mockWeatherResponse);

        expect(facade.connect).toHaveBeenCalled();
        expect(component.weatherData).toEqual(mockWeatherResponse);
        expect(component.hasChartData).toBe(true);
        expect(component.chartSeries[0].data).toEqual([27, 28, 26, 25]);
    });

    it('should delegate search and refresh actions to the facade', () => {
        component.city = 'Dhaka';

        component.searchCity();
        component.loadWeather();

        expect(facade.searchCity).toHaveBeenCalledWith('Dhaka');
        expect(facade.refreshWeather).toHaveBeenCalled();
    });

    it('should toggle theme through the theme service', () => {
        component.toggleTheme();

        expect(theme.toggleTheme).toHaveBeenCalledWith(false);
        expect(component.isDarkMode).toBe(true);
    });
});
