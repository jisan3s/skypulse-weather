import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeatherApiResponse } from '../../../../core/models/weather';
import { Loader } from '../../../../shared/components/loader/loader';
import { WeatherFacade } from '../../../../core/store/weather-facade';

@Component({
    selector: 'app-details',
    imports: [CommonModule, Loader],
    templateUrl: './details.html',
    styleUrl: './details.scss',
})
export class Details {

    private readonly destroyRef = inject(DestroyRef);

    weatherData: WeatherApiResponse | null = null;
    loading = false;

    constructor(private weatherFacade: WeatherFacade) {}

    ngOnInit(): void {
        this.weatherFacade.weather$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
            this.weatherData = data;
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
