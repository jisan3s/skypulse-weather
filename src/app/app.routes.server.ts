import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Client
    },
    {
        path: 'forecast',
        renderMode: RenderMode.Client
    },
    {
        path: 'details',
        renderMode: RenderMode.Client
    },
    {
        path: '**',
        renderMode: RenderMode.Client
    }
];
