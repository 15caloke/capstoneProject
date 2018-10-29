/* 
Author: Douglas Kumar
Date: October 2018
*/

'use strict';

var mongoose = require('mongoose'),
	Block = mongoose.model('Block');

// BLOCK CONTROLS
exports.listBlocks = function(req, res) {
	Block.find({}, function(err, block){
		if(err)
			res.send(err);
		res.json(block);
	});
};

exports.findByAssetID = function(req, res) {
	Block.find({AssetID: req.params.AssetID}, function(err, block){
		if(err)
			res.send(err);
		res.json(block);
	});
};

exports.findByAssetIDCount = function(req, res) {
	Block.find({AssetID: req.params.AssetID, AssetBlockCount: req.params.Count}, function(err, block){
		if(err)
			res.send(err);
		res.json(block);
	});
};

exports.createBlock = function(req, res) {
    var new_block = new Block(req.body);
    new_block.save(function(err, block){
	if(err)
    	res.send(err);
	res.json(block);
	});
};

// BlockID removed from Model, 
// these functions will no longer work

/* exports.readBlock = function(req, res){
	Block.find({BlockID: req.params.BlockID}, function(err, block){
	if(err)
    	res.send(err);
	res.json(block);
	});
};

exports.updateBlock = function(req, res){
	Block.findOneAndUpdate({BlockID: req.params.BlockID}, req.body, {new: true}, function(err, block){
	if(err)
    	res.send(err);
	res.json(block);		
	});
};

exports.deleteBlock = function(req, res){
	Block.remove({AssetBlockCount: req.params.AssetBlockCount}, function(err, block){
		if(err)
			res.send(err);
		res.json({ message: 'Block successfully deleted'});	
	});
};
 
exports.clearBlocks = function(req, res) {
	Block.remove({}, function(err, block){
		if (err)
			res.send(err);
		res.json({message: 'Successfully cleared ledger'});
	});
}; */