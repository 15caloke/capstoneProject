/* 
    Author: Ian Maskell, Douglas Kumar
    Date: August 2018
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ReadyHash Model Schema
var ReadyHashSchema = new Schema({
    ReadyHashID: {
        type: Number,
        required: 'Enter the ReadyHash ID'
    },
    AssetID: {
        type: Number,
        required: 'Enter the Asset ID'
    },
    Hash: {
        type: String,
        required: 'Enter the hash'
    }
});

module.exports = mongoose.model('ReadyHash', ReadyHashSchema);