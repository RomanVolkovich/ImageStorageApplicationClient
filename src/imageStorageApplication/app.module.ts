import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent }   from './main.component';
import { AppHeaderComponent } from "./page/header/app-header.component";
import { AppMainContentComponent } from "./page/app-main-content.component";
import { AppRequestService } from "./services/app-request.service";
import { AppRoutingModule } from "./app-routing";
import { HttpClientModule } from "@angular/common/http";
import { AppEditAlbumComponent } from "./page/content/album/app-edit-album.component";
import { AppNotFoundPageComponent } from "./page/content/not-found/app-not-found-page.component";
import { AppMyAlbumsComponent } from "./page/content/album/app-my-albums.component";
import { AppAlbumComponent } from "./page/content/album/app-album.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ErrorHandlerProvider } from "./exception/ErrorHandlerProvider.component";
import { AlertModule } from "./alert";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        AlertModule
    ],
    declarations: [
        AppMyAlbumsComponent,
        AppAlbumComponent,
        MainComponent,
        AppHeaderComponent,
        AppMainContentComponent,
        AppEditAlbumComponent,
        AppNotFoundPageComponent
    ],
    bootstrap: [
        MainComponent
    ],
    providers: [
        AppRequestService,
        {provide: ErrorHandler, useClass: ErrorHandlerProvider}
    ]
})
export class AppModule { }
