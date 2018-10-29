/* Author Ian Maskell

Minor additions: Calum Oke
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FabHashSchema = new Schema({
  Key: {
    type: String,
    required: "Need Hash Key"
  },
  Record: {
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
  }
});

module.exports = mongoose.model('FabHash', FabHashSchema)

