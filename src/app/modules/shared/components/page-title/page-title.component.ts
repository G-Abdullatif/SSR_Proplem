import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

    constructor() { }
    environment = environment;
    @Input() title: string = 'title';
    @Input() folder: string = '';
    @Input() image: string = '';
    @Input() parentPage: string = 'home';
    ngOnInit(): void {
    }

}
