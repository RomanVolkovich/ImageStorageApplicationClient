import { Component, OnInit } from "@angular/core";
import { AlertService } from "../../../alert";
import { Router } from "@angular/router";
import { noop } from "rxjs";

@Component({
    selector: 'no-found-page',
    template: ''
})
export class AppNotFoundPageComponent implements OnInit {

    constructor(private alertService: AlertService,
                private router: Router){}

    ngOnInit() {
        this.router.navigateByUrl('/').then(noop);
        this.alertService.warn('Запрошенная страница не была найдена, Вы возвращены на главную')
    }
}
