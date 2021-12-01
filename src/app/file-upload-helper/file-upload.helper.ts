import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {UploadOutput, UploadInput, UploadFile, UploadProgress, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../configurations/sequence';
import {split} from 'ts-node';
import { DatasetModel } from 'src/app/models/dataset.model';
import { MetadataModel } from '../models/metadata.model';
import { SequenceFileComponent } from '../datasets/sequence-file/sequence-file.component';


export class FileUploadHelper
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

    model: MetadataModel;

    metadata: MetadataModel;
    newDataset: DatasetModel = new DatasetModel();

    formData: FormData;
    file: UploadFile;
    uploadProgress: UploadProgress = null;
    dragOver: boolean;

    constructor() {
        this.resetNewFileObject();
   }


    resetNewFileObject(): void {
        this.metadata = new MetadataModel();
    }

    onUploadOutput(output: UploadOutput, component: SequenceFileComponent): void {
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
                component.whenDone();
                break;
        }
    }

    onUploadProgress(progress: UploadProgress): void {
        console.log(progress)
    }

    startUpload(emitter: EventEmitter<UploadInput>): void {
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
}
