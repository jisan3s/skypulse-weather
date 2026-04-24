import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loader } from './loader';

describe('Loader', () => {
    let component: Loader;
    let fixture: ComponentFixture<Loader>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Loader]
        })
        .compileComponents();

        fixture = TestBed.createComponent(Loader);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('message', 'Loading dashboard...');
        fixture.detectChanges();
    });

    it('should render the provided loading message', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.textContent).toContain('Loading dashboard...');
    });
});
