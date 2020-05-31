import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppEditAlbumComponent } from "./page/content/album/app-edit-album.component";
import { AppNotFoundPageComponent } from "./page/content/not-found/app-not-found-page.component";
import { AppMyAlbumsComponent } from "./page/content/album/app-my-albums.component";
import { AppAlbumComponent } from "./page/content/album/app-album.component";

const routes: Routes = [
    {
path: '',
children:[
    {path: '', redirectTo: '/my', pathMatch: 'full'},
    {path: 'my', component: AppMyAlbumsComponent},
    {path: 'album/:id', component: AppAlbumComponent},
    {path: 'edit-album', component: AppEditAlbumComponent},
    {path: '**', component: AppNotFoundPageComponent}
]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule {
}
