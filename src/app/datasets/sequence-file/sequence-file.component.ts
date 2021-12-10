import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatasetService} from '../../services/datasets.service';
import {Router} from '@angular/router';
import {ToastComponent} from '../../shared/toast/toast.component';
import {SequenceFilesService} from '../../services/sequence-files.service';

import {UploadOutput, UploadInput, UploadFile, UploadProgress, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../../configurations/sequence';
import {split} from 'ts-node';
import { DatasetModel } from 'src/app/models/dataset.model';
import { FileUploadModal } from 'src/app/file-upload-modal/file-upload.modal';

import { Observable } from 'rxjs';

@Component({
    selector: 'app-sequence-file',
    templateUrl: './sequence-file.component.html',
    styleUrls: ['./sequence-file.component.scss']
})
export class SequenceFileComponent extends FileUploadModal {

    tableSettings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            custom: [
                {
                    name: 'delete',
                    title: '<i class="fa fa-times" title="Delete"></i> Delete'
                },
                {
                    name: 'reassign',
                    title: '<i class="fa fa-chain" title="Assing"></i> Reassing'
                },
            ],
            position: 'right'
        },
        pager: {
            display: true,
            perPage: 20
        },
        columns: {
            uuid: {
                title: 'UUID'
            },
            originalFileName: {
                title: 'Original file name'
            },
            name: {
                title: 'Name'
            },
            creationDate: {
                title: 'Creation date',
            }
        }
    };
    sequenceFiles;
    datasets = [];
    newFile;
    newDataset: DatasetModel = new DatasetModel();

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadProgress: UploadProgress = null;
    dragOver: boolean;

    constructor(
        modalService: NgbModal,
        private datasetService: DatasetService,
        private sequenceFilesService: SequenceFilesService,
        private router: Router, public toast: ToastComponent) {
            super(modalService);
        this.resetNewFileObject();

        this.options = {
            concurrency: 1,
            maxUploads: 1,
            maxFileSize: SequenceConfigs.maxFileSize
        };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    }

    ngOnInit(): void {
        this.getDatasets();
        this.fetchMetadata();
        this.resetNewFileObject();
    }
    
    resetNewFileObject(): void {
        this.newFile = {
            dataset: DatasetModel,
            type: 'FASTA'
        };
    }

    getDatasets(): void {
        this.datasetService.getDatasets().subscribe(
            data => {
                this.datasets = data;
            },
            error1 => {
                console.log(error1);
            }
        );
    }

    fetchMetadata(): void {
        this.sequenceFilesService.getSequenceFiles().subscribe(
            data => {
                this.sequenceFiles = data;
            },
            error1 => {
                console.log(error1);
            }
        );
    }

    whenDone(): void
    {
        this.modalService.dismissAll();
        this.fetchMetadata();
    }

    fileBelongsToDataset(file, dataset): Boolean {
        return !!dataset.files && dataset.files.includes(file._id) && !!file.datasets && file.datasets.includes(dataset._id);
    }

    addFileToDataset(file, dataset) {
        if (!file.datasets) {
            file.datasets = [];
        }
        if (!dataset.file) {
            dataset.files = [];
        }
        if (!file.datasets.includes(dataset._id)) {
            file.datasets.push(dataset._id);
        }
        if (!dataset.files.includes(file._id)) {
            dataset.files.push(file._id);
        }
    }

    public startUpload(): void {
        super.startUpload(this.uploadInput);
    }

    editObject(): Observable<any> {
        return this.sequenceFilesService.editSequenceFile(this.newFile);
    }

    deleteObject($event: any): Observable<any> {
        return this.sequenceFilesService.deleteSequenceFile($event.data);
    }


}