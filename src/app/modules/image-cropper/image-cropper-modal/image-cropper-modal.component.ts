import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../interfaces';
import { base64ToFile } from '../utils/blob.utils';
@Component({
    selector: 'app-image-cropper-modal',
    templateUrl: './image-cropper-modal.component.html',
    styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent implements OnInit {

    constructor(
        public modal: NgbActiveModal,
    ) { }
    imageChangedEvent: any = '';
    croppedImage: any = '';
    aspectRatio: any = 3.5 / 4;
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    maintainAspectRatio = true;
    transform: ImageTransform = {};
    @Input() image: number;
    imageObject: any;
    ngOnInit(): void {
        if (localStorage.getItem("aspectRatio") != null) {
            let num = +localStorage.getItem("aspectRatio")
            this.aspectRatio = num
            localStorage.removeItem("aspectRatio")
        }
        this.imageChangedEvent = this.image;
    }
    save() {
        this.modal.close(this.imageObject);
        catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.image);
        })
    }


    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.imageObject =event
    }

    imageLoaded() {
        this.showCropper = true;
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }
    freeCrop() {
        this.maintainAspectRatio = !this.maintainAspectRatio
    }

    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }
}
