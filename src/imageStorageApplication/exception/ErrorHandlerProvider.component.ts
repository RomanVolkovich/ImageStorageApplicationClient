import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { AlertService } from "../alert";

@Injectable()
export class ErrorHandlerProvider implements ErrorHandler {

    constructor(private alertService: AlertService,
                private ngZone: NgZone) {
    }

    handleError(error) {
        this.ngZone.run(() => {
            this.alertService.error(error.error ?
                                        error.error.message ?
                                            error.error.message :
                                            error.error
                                        : error.message);
        });
    }
}
