export interface Coordinates {
    lat: number;
    lon: number;
}

export interface WeatherApiResponse {
    current_weather: CurrentWeather;
    hourly: HourlyForecast;
    hourly_units?: HourlyUnits;
}

export interface CurrentWeather {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
}

export interface HourlyForecast {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
}

export interface HourlyUnits {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
}

export interface WeatherCacheEntry {
    data: WeatherApiResponse;
    timestamp: number;
}

export interface GeoSearchResponse {
    results?: GeoSearchResult[];
}

export interface GeoSearchResult {
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
}
