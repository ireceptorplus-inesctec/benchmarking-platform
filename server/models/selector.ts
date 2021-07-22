import * as mongoose from 'mongoose';
import GeneralConfigs from '../configurations/general';
const Schema = mongoose.Schema;

const selectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    genes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SelectorGenes'
        }
    ],
    organism: {
        type: String,
        enum: GeneralConfigs.availableOrganisms,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privacy: {
        type: String,
        enum: GeneralConfigs.selectors.privacies,
        required: true
    },
    createdDate: { type: Date, default: Date.now }
});

const Selector = mongoose.model('Selector', selectorSchema);

export default Selector;