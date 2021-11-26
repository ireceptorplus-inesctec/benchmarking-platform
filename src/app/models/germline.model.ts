import { MetadataModel } from "./metadata.model";

export class GermlineModel extends MetadataModel {
    uuid: string;
    description: string;
    creationDate: Date;
};