import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Coordinates, WeatherApiResponse } from '../../../../core/models/weather';
import { Loader } from '../../../../shared/components/loader/loader';
import { WeatherFacade } from '../../../../core/store/weather-facade';

@Component({
    selector: 'app-forecast',
    imports: [CommonModule, Loader],
    templateUrl: './forecast.html',
    styleUrl: './forecast.scss',
})
export class Forecast {

    private readonly destroyRef = inject(DestroyRef);

    weatherData: WeatherApiResponse | null = null;
    location: Coordinates | null = null;
    loading = false;

    constructor(private weatherFacade: WeatherFacade) {}

    ngOnInit(): void {
        this.weatherFacade.weather$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
            this.weatherData = data;
        });

        this.weatherFacade.location$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((location) => {
            this.location = location;
        });

        this.weatherFacade.loading$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((loading) => {
            this.loading = loading;
        });

        this.weatherFacade.connect();
    }

    ngOnDestroy(): void {
        this.weatherFacade.disconnect();
    }
}
