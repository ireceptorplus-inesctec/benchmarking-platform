import * as mongoose from 'mongoose';
import GeneralConfigs from '../configurations/general';
const Schema = mongoose.Schema;

enum SelectorType
{
    UMI = "UMI",
    PRIMER = "PRIMER"
}

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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(SelectorType),
        required: true
    },
    createdDate: { type: Date, default: Date.now },
    privacy: {
        type: String,
        enum: GeneralConfigs.selectors.privacies,
        required: true
    }
});

const Selector = mongoose.model('Selector', selectorSchema);

export default Selector;
