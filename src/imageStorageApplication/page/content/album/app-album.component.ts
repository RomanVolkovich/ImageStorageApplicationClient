import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { noop, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import { AppRequestService } from "../../../services/app-request.service";
import { faAngleDoubleDown, faTrash, faAngleDoubleLeft, faAngleDoubleRight, faPlus, faBackward } from "@fortawesome/free-solid-svg-icons";
import { AlertService } from "../../../alert";

@Component({
    selector: 'app-album',
    templateUrl: './app-album.component.html'
})
export class AppAlbumComponent implements OnInit, OnDestroy {

    faIconDownload = faAngleDoubleDown;
    faIconLeft = faAngleDoubleLeft;
    faIconRight = faAngleDoubleRight;
    faIconTrash = faTrash;
    faIconPlus = faPlus;
    faIconBackward = faBackward;

    albumId;
    pictures = [];
    selectedFile: File;
    inputText = 'выберите файл';

    indexPagination = 1;

    openFieldAddFile = false;

    private destroy$ = new Subject<void>();

    constructor(@Inject(DOCUMENT) private document: Document,
                private http: HttpClient,
                private router: Router,
                private appRequest: AppRequestService,
                private alertService: AlertService) {

        if (!router.getCurrentNavigation() ||
            !router.getCurrentNavigation().extras.queryParams) {
            router.navigateByUrl('/').then(noop);
        }

        this.albumId = router.getCurrentNavigation().extras.queryParams.id;

    }

    ngOnInit() {

        this.appRequest.getPicturesByAlbumId(this.albumId)
            .subscribe(response => {
                this.pictures = [];
                this.extractedPictures(response);
            });
    }

    // здесь идет формирование объектов картинок, добавление их в наш общий массив для отображения
    // внутри общего массива лежат массивы по 6 элементом
    // так сделано для удобства пагинации (картинки будут отображаться по 6 штук на 1 странице)
    private extractedPictures(picturesArray, deletedId?: number) {

        let arrForPagination = [];

        picturesArray.forEach(pict => {

            if (pict.id === deletedId) {
                return;
            }

            arrForPagination.push({
                id: pict.id,
                name: pict.name,
                picByte: pict.picByte
            });

            // если в текущем подмассиве у нас 6 элементов,
            // то добавляем его в общий массив и обновляем подмассив
            if (arrForPagination.length === 6) {
                this.pictures.push(arrForPagination);
                arrForPagination = [];
            }
        });
        // если остались не добавленные, значит они влезут в общий массив и просто их добавим
        if (arrForPagination.length > 0) {
            this.pictures.push(arrForPagination);
        }
        if (this.indexPagination >= this.pictures.length) {
            this.indexPagination = this.pictures.length;
        }
    }

    // добавление файла в текущий альбом
    onUpload() {

        const uploadImageData = new FormData();
        uploadImageData.append('upload_file', this.selectedFile, this.selectedFile.name);

        this.appRequest.uploadFileInAlbum(this.albumId, uploadImageData)
            .subscribe((response) => {

                if (this.pictures.length === 0) {
                    this.pictures.push([]);
                }

                // для корректной работы пагинации
                // массив с каждой страницей у нас хранит по 6 объектов
                // если последний массив заполнен, то создадим новый
                if (this.pictures[this.pictures.length - 1].length === 6) {

                    this.pictures.push([]);
                    this.pictures[this.pictures.length - 1].push({
                        id: response.id,
                        name: response.name,
                        picByte: response.picByte
                    });

                } else {
                    this.pictures[this.pictures.length - 1].push({
                        id: response.id,
                        name: response.name,
                        picByte: response.picByte
                    })
                }

                this.indexPagination = this.pictures.length;
                this.openFieldAddFile = false;
                this.selectedFile = undefined;
                this.alertService.success('Изображение успешно загружено!');
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    addFile() {
        this.openFieldAddFile = !this.openFieldAddFile;
    }

    public onFileChanged(event) {
        this.selectedFile = event.target.files[0];
        this.inputText = this.selectedFile.name;
    }

    // клик по странице пагинации
    changePagination(index: number) {
        this.indexPagination = index;
    }

    // работа стрелок пагинации
    changePaginationArrow(direct: string) {
        switch (direct) {
            case 'prev':
                this.indexPagination--;
                return;
            case 'next':
                this.indexPagination++;
                return;
            default:
                return;
        }
    }

    // удаление картинки
    deletePicture(id: number) {
        this.appRequest.deletePicture(id)
            .subscribe(response => {
                // так как произошло удаление в неизвестном месте
                // перестроим массив, чтобы пагинация корректно отображала картинки
                const currentArray = [];
                this.pictures.forEach(array => array.forEach(elem => currentArray.push(elem)));
                this.pictures = [];
                this.extractedPictures(currentArray, id);
                this.alertService.success('Изображение успешно удалено!');
            });
    }

    // скачивание файла
    downloadFile(picture: any) {
        this.saveByteArray(picture.name, this.base64ToArrayBuffer(picture.picByte));
    }

    // сохранение файла
    saveByteArray(reportName, content) {
        const blob = new Blob([content], {type: "image/png"});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = reportName;
        link.click();
    };

    // конвертация байтов
    base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const binaryLen = binaryString.length;
        const picByte = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            picByte[i] = binaryString.charCodeAt(i);
        }
        return picByte;
    }
}
