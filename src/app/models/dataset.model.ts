import { MetadataModel } from "./metadata.model";

export class DatasetModel extends MetadataModel {
    uuid: string;
    name: string;
    description: string;
    creationDate: Date;
};