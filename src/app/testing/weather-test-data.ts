import { WeatherApiResponse } from '../core/models/weather';

export const mockWeatherResponse: WeatherApiResponse = {
    current_weather: {
        temperature: 27,
        windspeed: 14,
        weathercode: 1,
        time: '2026-04-24T14:00'
    },
    hourly_units: {
        temperature_2m: '°C',
        relative_humidity_2m: '%',
        wind_speed_10m: 'km/h'
    },
    hourly: {
        time: [
            '2026-04-24T14:00',
            '2026-04-24T15:00',
            '2026-04-24T16:00',
            '2026-04-24T17:00'
        ],
        temperature_2m: [27, 28, 26, 25],
        relative_humidity_2m: [64, 61, 67, 70],
        wind_speed_10m: [14, 16, 18, 19]
    }
};
