import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions} from 'ngx-uploader';
import SequenceConfigs from '../../../../server/configurations/sequence';
import {SelectorsService} from '../../services/selectors.service';
import {ToastComponent} from '../../shared/toast/toast.component';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-selector',
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
    @ViewChild('selectorEditModal') private selectorEditModal: TemplateRef<any>;

    tableSettings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            custom: [{
                name: 'details',
                title: '<i class="fa fa-eye" title="View"></i> View &nbsp;'
            }, {
                name: 'edit',
                title: '<i class="fa fa-pencil" title="Edit"></i> Edit &nbsp;'
            }, {
                name: 'delete',
                title: '<i class="fa fa-remove" title="Delete"></i> Delete &nbsp;'
            }],
            position: 'right'
        },
        pager: {
            display: true,
            perPage: 20
        },
        columns: {
            name: {
                title: 'Name'
            },
            createdDate: {
                title: 'Date'
            },
            privacy: {
                title: 'Visibility'
            }
        }
    };
    selectors;

    newSelector;

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes;
    dragOver: boolean;


    constructor(private router: Router, private modalService: NgbModal, private selectorService: SelectorsService, public toast: ToastComponent, private authService: AuthService) {
        this.options = {concurrency: 1, maxUploads: 1, maxFileSize: SequenceConfigs.maxFileSize};
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit(): void {
        this.resetNewSelectorObject();
        this.getSelectors();
    }

    resetNewSelectorObject(): void {
        this.newSelector = {
            name: null,
            privacy: null
        };
    }

    tableEvent($event) {
        console.log($event);

        if ($event.action === 'details') {
            this.router.navigate(['/selectors', $event.data._id, 'vgenes']);
        }
        if ($event.action === 'edit') {
            if (!!this.authService.currentUser && this.authService.currentUser._id === $event.data.owner) {
                this.newSelector = $event.data;
                this.modalService.open(this.selectorEditModal).result.then((result) => {
                    console.log(this.newSelector);
                    this.saveOrEditSelector();

                }, (reason) => {
                    console.log(reason);
                });
            } else {
                this.toast.setMessage('You can not edit selectors which don\'t belong to you', 'danger');
            }

        }
        if ($event.action === 'delete') {
            if (confirm('Are you sure you want to delete selector ' + $event.data.name + '? If you have used this selector, references might be broken.')) {
                this.selectorService.deleteSelector($event.data).subscribe(
                    data => {
                        this.toast.setMessage('Selector deleted', 'success');
                        this.getSelectors();
                    },
                    error => {
                        this.toast.setMessage(error.message, 'danger');
                    }
                );
            }
        }
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
            console.log(this.newSelector);
            this.saveOrEditSelector();

        }, (reason) => {
            console.log('modal closed');
        });
    }


    getSelectors(): void {
        this.selectorService.getSelectors().subscribe(
            data => {
                console.log(data);
                this.selectors = data;
            },
            error1 => {
                console.log(error1);
            }
        );
    }

    saveOrEditSelector(): void {
        if (!!this.newSelector._id) {
            // is editing an existing selector
            this.selectorService.editSelector(this.newSelector).subscribe(
                data => {
                    this.toast.setMessage('Selector successfully edited.', 'success');
                    this.getSelectors();
                },
                error1 => {
                    console.log(error1);
                    this.toast.setMessage('An error occurred. ' + error1.error.error, 'danger');
                }
            );
        } else {
            // save a new selector
            this.selectorService.addSelector(this.newSelector).subscribe(
                data => {
                    console.log(data);
                    this.toast.setMessage('New selector created', 'success');
                    window.location.reload();
                },
                error1 => {
                    console.log(error1);
                    this.toast.setMessage('An error occurred. ' + error1.error.error, 'danger');
                }
            );
        }
    }

}
