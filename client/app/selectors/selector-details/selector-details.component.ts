import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectorsService} from '../../services/selectors.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../../server/configurations/sequence';
import {ToastComponent} from '../../shared/toast/toast.component';
import * as _ from 'underscore';

@Component({
    selector: 'app-selector-details',
    templateUrl: './selector-details.component.html',
    styleUrls: ['./selector-details.component.scss']
})
export class SelectorDetailsComponent implements OnInit {

    @ViewChild('addSelectorGenesModal') private fileEditModal: TemplateRef<any>;
    selector;
    selectorID;

    genes = [];

    newFile;
    chains = ['IGH', 'IGK', 'IGL', 'TRA', 'TRB', 'TRD', 'TRG'];

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes;
    dragOver: boolean;

    tableSettings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            custom: [],
            position: 'right'
        },
        pager: {
            display: true,
            perPage: 20
        },
        columns: {
            name: {
                title: 'Gene ID'
            },
            chain: {
                title: 'Chain'
            },
            sequence: {
                title: 'Gene Sequence'
            }
        }
    };

    constructor(private modalService: NgbModal,
                private route: ActivatedRoute,
                private router: Router,
                private selectorService: SelectorsService,
                public toast: ToastComponent) {


        this.options = {concurrency: 1, maxUploads: 1, maxFileSize: SequenceConfigs.maxFileSize};
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit(): void {
        let params = {id: this.route.snapshot.paramMap.get('id')};
        this.selectorID = params.id;
        const routeParts = this.router.url.split('/');
        this.getSelector();
    }


    resetNewFileObject(): void {
        this.newFile = {
            type: 'FASTA',
            chain: 'IGH',
            selector: this.selectorID
        };
    }

    getSelector(): void {
        this.selectorService.getSelector({_id: this.selectorID}).subscribe(
            data => {
                this.selector = data;
                this.genes =this.selector.genes;
                this.resetNewFileObject();
            },
            error => {
                console.log(error);
            }
        );
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
            if (!!this.newFile._id) {
                this.selectorService.addSelectorGenes(this.newFile).subscribe(
                    data => {
                        this.resetNewFileObject();
                        this.toast.setMessage('Added gene to selector' + this.selector.name,
                            'success');
                        this.getSelector();
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


    onUploadOutput(output: UploadOutput): void {
        console.log(output);
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
                this.modalService.dismissAll();
                this.getSelector();
                break;
        }
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: '/api/selectorGenes',
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
}
