import {Component, OnInit} from '@angular/core';
import {SequenceService} from '../../services/sequence.service';

@Component({
    selector: 'app-sequences',
    templateUrl: './sequences.component.html',
    styleUrls: ['./sequences.component.scss']
})
export class SequencesComponent implements OnInit {
    tableSettings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            //custom: [         ],
            position: 'right'
        },
        pager: {
            display: true,
            perPage: 20
        },
        columns: {
            seqId: {
                title: 'Sequence ID'
            },
            sourceFile: {
                title: 'File',
            },
            datasetId: {
                title: 'Datasets'
            },
            content: {
                title: 'Sequence',
                type: 'html',
                valuePrepareFunction: (sequence) => {
                    var strSeq = "<span class=\"nucleic-scheme\">";

                    for (var aa = 0; aa < sequence.length; ++aa) {
                        strSeq += "<span class=\"" + sequence[aa]?.toLowerCase() + "\">" + sequence[aa] + "</span>";
                    }

                    strSeq += "</span>";

                    return strSeq;
                }
            }
        }
    };
    sequences = [];

    constructor(private sequenceService: SequenceService) {
    }

    ngOnInit(): void {
        this.getSequences();
    }

    getSequences(): void {
        this.sequenceService.getSequences().subscribe(data => {
            this.sequences = data;
        }, error1 => {
            console.log(error1);
        });
    }

}
