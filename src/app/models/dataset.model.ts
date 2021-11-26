import { DataModel } from "./data.model";

export class DatasetModel extends DataModel {
    uuid: string;
    name: string;
    description: string;
    creationDate: Date;
};