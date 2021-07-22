import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;


const selectorGenesSchema = new mongoose.Schema({
    name: String,
    chain: String,
    sequence: String
});

const SelectorGenes = mongoose.model('SelectorGenes', selectorGenesSchema);

export default SelectorGenes;
