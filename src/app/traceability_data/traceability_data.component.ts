import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatasetService} from '../../services/datasets.service';
import {Router} from '@angular/router';
import {ToastComponent} from '../../shared/toast/toast.component';
import {TraceabilityDatasService} from '../../services/traceability-data.service';

import {UploadOutput, UploadInput, UploadFile, UploadProgress, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../../configurations/sequence';
import {split} from 'ts-node';
import { DatasetModel } from 'src/app/models/dataset.model';

@Component({
    selector: 'app-traceability-data',
    templateUrl: './traceability-data.component.html',
    styleUrls: ['./traceability-data.component.scss']
})
export class TraceabilityDataComponent implements OnInit {
    @ViewChild('fileEditModal') private fileEditModal: TemplateRef<any>;

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
    uploadInput: EventEmitter<UploadInput>;
    uploadProgress: UploadProgress = null;
    dragOver: boolean;


    constructor(
        private modalService: NgbModal,
        private datasetService: DatasetService,
        private sequenceFilesService: TraceabilityDatasService,
        private router: Router, public toast: ToastComponent) {
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
        this.getTraceabilityDatas();
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

    getTraceabilityDatas(): void {
        this.sequenceFilesService.getTraceabilityDatas().subscribe(
            data => {
                this.sequenceFiles = data;
            },
            error1 => {
                console.log(error1);
            }
        );
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

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
            if (!!this.newFile._id) {
                this.sequenceFilesService.editTraceabilityData(this.newFile).subscribe(
                    data => {
                        this.resetNewFileObject();
                        this.getTraceabilityDatas();
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

    tableEvent($event) {
        console.log($event);
        if ($event.action === 'delete') {
            if (confirm('Are you sure you want to delete file ' + $event.data.name)) {
                this.sequenceFilesService.deleteTraceabilityData($event.data).subscribe(
                    data => {
                        this.getTraceabilityDatas();
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
                this.modalService.dismissAll();
                this.getTraceabilityDatas();
                break;
        }
    }

    onUploadProgress(progress: UploadProgress): void {
        console.log(progress)
    }

    startUpload(): void {
        this.newFile.dataset = this.newDataset;
        this.newFile.dataset = JSON.stringify(this.newFile.dataset);
        console.log("newfile")
        console.log(this.newFile)
        const event: UploadInput = {
            type: 'uploadAll',
            //url: '/api/sequenceFile',
            url: '/api/dataset',
            method: 'POST',
            headers: {'Authorization': 'JWT ' + localStorage.getItem('token')},  // <----  set headers
            data: this.newFile,
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
