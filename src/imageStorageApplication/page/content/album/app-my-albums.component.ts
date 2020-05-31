import { Component, OnInit } from "@angular/core";
import { AppRequestService } from "../../../services/app-request.service";
import { Router } from "@angular/router";
import { noop } from "rxjs";
import { faPencilAlt, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AlertService } from "../../../alert";

@Component({
    selector: 'app-my-album',
    templateUrl: './app-my-albums.component.html'
})
export class AppMyAlbumsComponent implements OnInit {

    faIconPencilAlt = faPencilAlt;
    faIconTrash = faTrash;
    faIconPlus = faPlus;

    public albums = [];

    constructor(private appRequest: AppRequestService,
                private router: Router,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.refreshAlbum();
    }

    refreshAlbum() {
        this.appRequest.getAlbums()
            .subscribe(response => {
                response.forEach(album =>
                    this.albums.push({
                        id: album.id,
                        name: album.name,
                        description: album.description,
                        picture: album.pictures[0] ? album.pictures[0].picByte : null
                    }));
            });
    }

    createAlbum() {
        this.router.navigate(['/edit-album'], {queryParams: {id: null, name: '', description: ''}}).then(noop);
    }

    redirectToAlbum(id: number) {
        this.appRequest.getAlbumById(id);
    }

    editAlbum(id: number, name: string, description: string) {
        this.router.navigate(['/edit-album'], {queryParams: {id: id, name: name, description: description}}).then(noop);
    }

    deleteAlbum(album: any) {
        this.appRequest.deleteAlbum(album.id)
            .subscribe(res => {
                this.albums = [];
                this.refreshAlbum();
                this.alertService.success('Альбом \'' + album.name + '\' удален!');
            });
    }
}
