import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexStroke,
    NgApexchartsModule
} from 'ng-apexcharts';
import { Coordinates, WeatherApiResponse } from '../../../../core/models/weather';
import { Theme } from '../../../../core/services/theme';
import { Loader } from '../../../../shared/components/loader/loader';
import { WeatherFacade } from '../../../../core/store/weather-facade';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, NgApexchartsModule, Loader],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {

    private readonly destroyRef = inject(DestroyRef);

    // 🔍 SEARCH
    city: string = '';

    lat: number = 40.7;
    lon: number = -74;

    weatherData: WeatherApiResponse | null = null;
    loading: boolean = false;
    errorMessage: string | null = null;
    lastUpdated: Date | null = null;

    constructor(
        private weatherFacade: WeatherFacade,
        private theme: Theme,
        private cdr: ChangeDetectorRef
    ) {
        this.isDarkMode = this.theme.initializeTheme();
    }

    ngOnInit(): void {
        this.weatherFacade.weather$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
            this.weatherData = data;
            this.buildChart();
            this.cdr.detectChanges();
        });

        this.weatherFacade.loading$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((loading) => {
            this.loading = loading;
            this.cdr.detectChanges();
        });

        this.weatherFacade.error$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((message) => {
            this.errorMessage = message;
            this.cdr.detectChanges();
        });

        this.weatherFacade.lastUpdated$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
            this.lastUpdated = value;
            this.cdr.detectChanges();
        });

        this.weatherFacade.location$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((location: Coordinates | null) => {
            if (!location) {
                return;
            }

            this.lat = location.lat;
            this.lon = location.lon;
            this.cdr.detectChanges();
        });

        this.weatherFacade.connect();
    }

    ngOnDestroy(): void {
        this.weatherFacade.disconnect();
    }

    // 🔍 SEARCH CITY
    searchCity(): void {
        this.weatherFacade.searchCity(this.city);
    }

    // 🌦️ WEATHER LOAD
    loadWeather(): void {
        this.weatherFacade.refreshWeather();
    }

    // 🌡️ WEATHER ICON
    getWeatherIcon(code: number): string {
        const icons: any = {
            0: '☀️',   // Clear sky
            1: '🌤️',   // Mainly clear
            2: '⛅',   // Partly cloudy
            3: '☁️',   // Overcast
            45: '🌫️',  // Fog
            48: '🌫️',  // Depositing rime fog
            51: '🌦️',  // Drizzle
            61: '🌧️',  // Rain
            63: '🌧️',
            65: '🌧️',
            71: '🌨️',  // Snow
            80: '🌦️',  // Rain showers
            95: '⛈️',  // Thunderstorm
        };

        return icons[code] || '❓';
    }

    // 🌜 DARK MODE
    isDarkMode: boolean = false;
    toggleTheme(): void {
        this.isDarkMode = this.theme.toggleTheme(this.isDarkMode);
    }

    // 📊 CHART
    chartSeries: ApexAxisChartSeries = [];
    chartDetails: ApexChart = {
        type: 'line',
        height: 300
    };
    chartXaxis: ApexXAxis = {
        categories: []
    };
    chartTitle: ApexTitleSubtitle = {
        text: 'Hourly Temperature',
        align: 'left'
    };
    chartDataLabels: ApexDataLabels = {
        enabled: false
    };
    chartStroke: ApexStroke = {
        curve: 'smooth'
    };

    // 📊 BUILD CHART
    buildChart(): void {
        const temps = this.weatherData?.hourly?.temperature_2m || [];
        const times = this.weatherData?.hourly?.time || [];

        this.chartSeries = [
            {
                name: 'Temperature',
                data: temps.slice(0, 12)
            }
        ];

        this.chartXaxis = {
            categories: times.slice(0, 12).map((t: string) =>
                new Date(t).getHours() + ':00'
            )
        };
    }

    get hasChartData(): boolean {
        return this.chartSeries.length > 0 && this.chartSeries[0].data.length > 0;
    }
}
