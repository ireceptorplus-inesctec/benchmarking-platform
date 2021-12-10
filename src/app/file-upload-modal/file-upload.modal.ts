import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {UploadOutput, UploadInput, UploadFile, UploadProgress, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../configurations/sequence';
import {split} from 'ts-node';
import { DatasetModel } from 'src/app/models/dataset.model';
import { MetadataModel } from '../models/metadata.model';

import { Observable } from 'rxjs';


export abstract class FileUploadModal implements OnInit
{
   
   /**
     * The name of the model to be shown in the front end
    */
    modelName: String;

    /**
     * The name of the model to be shown in the front end with the first letter capital.
     */
     modelNameCapital: String;

     /**
      * The name of the model to be shown in the front end with the first letter capital.
      */
      modelNamePlural: String;
      
     /**
      * The name of the model to be shown in the front end with the first letter capital.
      */
      modelNamePluralAndCapital: String;

    metadata: MetadataModel;
    newDataset: DatasetModel = new DatasetModel();

    formData: FormData;
    file: UploadFile;
    uploadProgress: UploadProgress = null;
    dragOver: boolean;

    newFile;


    constructor(
        protected modalService: NgbModal) {
        this.resetNewFileObject();
   }

   @ViewChild('fileEditModal') private fileEditModal: TemplateRef<any>;

   abstract ngOnInit(): void ;

    resetNewFileObject(): void {
        this.metadata = new MetadataModel();
    }
    
    abstract fetchMetadata(): void;
    abstract editObject(): Observable<any>;
    abstract deleteObject($event: any): Observable<any>;

    onUploadOutput(output: UploadOutput): void {
        console.log(output);

        this.uploadProgress = output?.file?.progress;

        switch (output.type) {
            case 'allAddedToQueue':
                // uncomment this if you want to auto upload files when added
                // const event: UploadInput = {
                //   type: 'uploadAll',
                //   url: '/upload',
                //   method: 'POST',
                //   data: { foo: 'bar' }
                // };
                // this.uploadInput.emit(event);
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.file = output.file;
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    this.file = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.file = null;
                break;
            case 'dragOver':
                this.dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this.dragOver = false;
                break;
            case 'done':
                this.uploadProgress = null;
                this.modalService.dismissAll();
                this.whenDone();
                break;
        }
    }

    abstract whenDone(): void;

    onUploadProgress(progress: UploadProgress): void {
        console.log(progress)
    }

    public startUpload(emitter: EventEmitter<UploadInput>): void {
        console.log("using new fileupload helper")
        //this.metadataAndFile = JSON.stringify(this.metadataAndFile);
        let requestForm: any = {
            metadata: this.metadata
        };
        const event: UploadInput = {
            type: 'uploadAll',
            //url: '/api/sequenceFile',
            url: '/api/dataset',
            method: 'POST',
            headers: {'Authorization': 'JWT ' + localStorage.getItem('token')},  // <----  set headers
            data: requestForm,
            includeWebKitFormBoundary: true // <----  set WebKitFormBoundary
        };

        emitter.emit(event);
    }

    tableEvent($event) {
        console.log($event);
        if ($event.action === 'delete') {
            if (confirm('Are you sure you want to delete file ' + $event.data.name)) {
                this.deleteObject($event).subscribe(
                    data => {
                        this.fetchMetadata();
                    },
                    error1 => {
                        console.log(error1);
                    }
                );
            }
        }
        if ($event.action === 'reassign') {
            this.newFile = $event.data;
            this.newFile.datasets = [];
            this.open(this.fileEditModal);
        }
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
            if (!!this.newFile._id) {
                this.editObject().subscribe(
                    data => {
                        this.resetNewFileObject();
                        this.fetchMetadata();
                    },
                    error1 => {
                        console.log(error1);
                        this.resetNewFileObject();
                    }
                );

            }
        }, (reason) => {
            console.log('modal closed');
            this.resetNewFileObject();
        });
    }
}
