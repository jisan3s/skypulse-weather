import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/weather/pages/home/home').then((m) => m.Home)
    },
    {
        path: 'forecast',
        loadComponent: () => import('./features/forecast/pages/forecast/forecast').then((m) => m.Forecast)
    },
    {
        path: 'details',
        loadComponent: () => import('./features/details/pages/details/details').then((m) => m.Details)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
