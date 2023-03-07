import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SplashScreenService } from './splash-screen.service';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
    @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;
    constructor(public splashScreenService: SplashScreenService) { }

    ngOnInit(): void {
    }
}
