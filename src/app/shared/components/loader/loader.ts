import { Component, input } from '@angular/core';

@Component({
    selector: 'app-loader',
    imports: [],
    templateUrl: './loader.html',
    styleUrl: './loader.scss',
})
export class Loader {
    readonly message = input('Loading...');
}
