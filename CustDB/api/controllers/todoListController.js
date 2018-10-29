/* 
Author Ian Maskell, Douglas Kumar
Date: Aug 2018
*/

'use strict';

var mongoose = require('mongoose'),
	ReadyHash = mongoose.model('ReadyHash');

// READYHASH CONTROLS
exports.listReadyHashes = function(req, res) {
	ReadyHash.find({}, function(err, readyhash){
		if(err)
			res.send(err);
		res.json(readyhash);
	});
};

exports.createReadyHash = function(req, res) {
    var new_readyhash = new ReadyHash(req.body);
    new_readyhash.save(function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);
	});
};

exports.readReadyHash = function(req, res){
	ReadyHash.find({ReadyHashID: req.params.ReadyHashID}, function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);
	});
};

exports.updateReadyHash = function(req, res){
	ReadyHash.findOneAndUpdate({ReadyHashID: req.params.ReadyHashID}, req.body, {new: true}, function(err, readyhash){
	if(err)
    	res.send(err);
	res.json(readyhash);		
	});
};

exports.deleteReadyHash = function(req, res){
	ReadyHash.remove({ReadyHashID: req.params.ReadyHashID}, function(err, readyhash){
			if(err)
    			res.send(err);
			res.json({ message: 'ReadyHash successfully deleted'});	
	});
};

exports.clearReadyHashes = function(req, res) {
	ReadyHash.remove({}, function(err, readyhash){
		if (err)
			res.send(err);
		res.json({message: 'Successfully cleared database'});
	});
};