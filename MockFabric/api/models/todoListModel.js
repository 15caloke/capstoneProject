/* 
    Author: Douglas Kumar
    Date: October 2018
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Fabric Block Model Schema
var BlockSchema = new Schema({
    /* BlockID: {
        type: Number,
        required: 'Enter the Block ID'
    }, */
    AssetID: {
        type: Number,
        required: 'Enter the Asset ID'
    },
    AssetBlockCount: {
        type: Number,
        required: 'Enter the Asset Block Count'
    },
    Hash: {
        type: String,
        required: 'Enter the hash'
    }
});

module.exports = mongoose.model('Block', BlockSchema);