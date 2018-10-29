/* 
Author: Ian Maskell, Douglas Kumar
Date: Oct 2018

*/

'use strict';

var mongoose = require('mongoose'),
    FabHashes = mongoose.model('FabHash'),
	request = require('request-promise');

// READYHASH CONTROLS
exports.listReadyHashes = function(req, res) {
	FabHashes.find({}, function(err, readyhash){
		if(err)
			res.send(err);
		res.json(readyhash);
	});
};

exports.createReadyHash = function(req, res) {
    var new_readyhash = new FabHashes(req.body);
    new_readyhash.save(function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);
	});
};

exports.readReadyHash = function(req, res){
	FabHashes.find({ReadyHashID: req.params.ReadyHashID}, function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);
	});
};

exports.updateReadyHash = function(req, res){
	FabHashes.findOneAndUpdate({ReadyHashID: req.params.ReadyHashID}, req.body, {new: true}, function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);		
	});
};

exports.deleteReadyHash = function(req, res){
	FabHashes.remove({ReadyHashID: req.params.ReadyHashID}, function(err, readyhash){
			if(err)
    			res.send(err);
			res.json({ message: 'ReadyHash successfully deleted'});	
	});
};

exports.clearReadyHashes = function(req, res) {
	FabHashes.remove({}, function(err, readyhash){
		if (err)
			res.send(err);
		res.json({message: 'Successfully cleared database'});
	});
};
