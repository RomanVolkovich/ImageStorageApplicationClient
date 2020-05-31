import {Component, Input} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AppRequestService } from "../../../services/app-request.service";
import { noop } from "rxjs";
import {AlertService} from "../../../alert";

@Component({
    selector: 'app-edit-album-modal',
    templateUrl: './app-edit-album.component.html'
})
export class AppEditAlbumComponent {
    public contextFormGroup;

    constructor(private fb: FormBuilder,
                private router: Router,
                private appRequest: AppRequestService,
                private alertService: AlertService) {
        this.contextFormGroup = this.getFormBuild();
    }

    getFormBuild(): FormGroup {
        return this.fb.group({
            id: this.router.getCurrentNavigation().extras.queryParams.id,
            name: this.router.getCurrentNavigation().extras.queryParams.name,
            description: this.router.getCurrentNavigation().extras.queryParams.description
        })
    }

    cancel() {
        this.router.navigateByUrl('/').then(noop)
    }

    save() {
        this.appRequest.newAlbum(this.contextFormGroup.value)
            .subscribe(res => {
                this.router.navigateByUrl('/my').then(noop);
                this.alertService.success('Альбом сохранен!');
            });
    }

    edit() {
        this.appRequest.editAlbum(this.contextFormGroup.value)
            .subscribe(res => {
                this.router.navigateByUrl('/my').then(noop);
                this.alertService.success('Альбом отредактирован!');
            });
    }
}
