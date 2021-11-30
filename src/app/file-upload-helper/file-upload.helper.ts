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

    sequenceFiles;
    datasets = [];
    metadata: MetadataModel;
    newDataset: DatasetModel = new DatasetModel();

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    uploadProgress: UploadProgress = null;
    dragOver: boolean;

    newFile;

    constructor() {
        this.resetNewFileObject();

        this.options = {
            concurrency: 1,
            maxUploads: 1,
            maxFileSize: SequenceConfigs.maxFileSize
        };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
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
                    this.files.push(output.file);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
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

    startUpload(): void {
        console.log("using new fileupload helper")
        //this.metadataAndFile = JSON.stringify(this.metadataAndFile);
        let requestForm;
        requestForm = {
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

        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({type: 'cancel', id: id});
    }

    removeFile(id: string): void {
        this.uploadInput.emit({type: 'remove', id: id});
    }

    removeAllFiles(): void {
        this.uploadInput.emit({type: 'removeAll'});
    }

}
