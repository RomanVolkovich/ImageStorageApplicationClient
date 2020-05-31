import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AppRequestService {

    constructor(private http: HttpClient,
                private router: Router){

    }

    public newAlbum(album: any): Observable<any> {
        return this.http.post(environment.api + 'album/new', album);
    }

    public editAlbum(album: any): Observable<any> {
        return this.http.post(environment.api + 'album/edit/', album);
    }

    public deleteAlbum(albumId: number): Observable<any> {
        return this.http.get(environment.api + 'album/delete/' + albumId);
    }

    public getAlbums(): Observable<any> {
        return this.http.get(environment.api + 'album');
    }

    public getAlbumById(id: number) {
        return this.http.get(environment.api + 'album/'+ id)
            .subscribe(response => this.router.navigate(['album/' + id], {queryParams: {id: id}}));
    }

    public getPicturesByAlbumId(albumId: number): Observable<any> {
        return this.http.get(environment.api + 'picture/album/' + albumId);
    }

    public deletePicture(id: number) {
        return this.http.get(environment.api + 'picture/delete/' + id);
    }

    public uploadFileInAlbum(albumId: number, file: FormData): Observable<any> {
        return this.http.post(environment.api + 'picture/upload/' + albumId, file);
    }
}
