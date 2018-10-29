/* 
Author: Ian Maskell, Douglas Kumar
Date: Oct 2018

*/

'use strict';

var mongoose = require('mongoose'),
	Site = mongoose.model('Site'),
	Location = mongoose.model('Location'),
    Asset = mongoose.model('Asset'),
    Component = mongoose.model('Component'),
    Observation = mongoose.model('Observation'),
    ConnectionCode = mongoose.model('ConnectionCode'),
	SamplePoint = mongoose.model('SamplePoint'),
	request = require('request-promise');



function identifyObsAsset(connectCodeId) {
	return new Promise(function(resolve, reject) {
		try {

			ConnectionCode.find({ConnectionCodeID: connectCodeId}, function(err, connectioncode) {
			})
			.then(connectioncode => {
				console.log("conncode: " + connectioncode);
				return new Promise(function(resolve, reject) {
					try {
						if (connectioncode.length > 0) {
							SamplePoint.find({SamplePointID: connectioncode[0].SamplePointID}, function(err, samplepoint) {
							})
							.then(samplepoint => {
								resolve(samplepoint);
							})
							.catch(function(err) {
								reject
							});
						} else {
							reject('No related connection codes.');
						}
					} catch(err) {
						reject(err);
					}
				});
			})
			.then(samplepoint => {
				console.log("samppoint: " + samplepoint);
				return new Promise(function(resolve, reject) {
					try {
						if (samplepoint.length > 0) {
							Component.find({ComponentID: samplepoint[0].ComponentID}, function(err, component) {
							})
							.then(component => {
								resolve(component);
							})
							.catch(function(err) {
								reject(err);
							});
						} else {
							reject('No related samplepoints.');
						}
					} catch(err) {
						reject(err);
					}
				});
			})
			.then(component => {
				console.log(component);
				if (component.length > 0) {
					resolve(component[0].AssetID);
				} else {
					reject('No related components');
				}
			})
			.catch(function(err) {
				reject(err);
			});

		} catch(err) {
			reject(err);
		}
	});
}

function hashAfterChange(assetId) {
	return new Promise(function(resolve, reject) {
		try {
			var address = 'https://ue-server.glitch.me/prepare/' + assetId;
			request(address, function(error, response, data) {
			})
			.then(data => {
				resolve(data);
			})
			.catch(function(err) {
				reject(err);
			});
		} catch(err) {
			reject(err);
		}
	});
}



// SITE CONTROLS
exports.listSites = function(req, res) {
	Site.find({}, function(err, site){
		if(err)
			res.send(err);
		res.json(site);
	});
};

exports.createSite = function(req, res) {
	var new_site = new Site(req.body);
	new_site.save(function(err, site){
		if(err)
			res.send(err);
		res.json(site);
	});
};

exports.readSite = function(req, res) {
	Site.find({SiteID: req.params.SiteID}, function(err, site){
		if(err)
			res.send(err);
		res.json(site);
	});
};

exports.updateSite = function(req, res) {
	Site.findOneAndUpdate({SiteID: req.params.SiteID}, function(err, site){
		if(err)
			res.send(err);
		res.json(site);
	});
};

exports.deleteSite = function(req, res) {
	Site.remove({SiteID: req.params.SiteID}, function(err, site){
		if(err)
			res.send(err);
		res.json(site);
	});
};



// LOCATION CONTROLS
exports.listLocations = function(req, res) {
	Location.find({}, function(err, location){
		if(err)
			res.send(err);
		res.json(location);
	});
};

exports.createLocation = function(req, res) {
	var new_location = new Location(req.body);
	new_location.save(function(err, location){
		if(err)
			res.send(err);
		res.json(location);
	});
};

exports.readLocation = function(req, res) {
	Location.find({LocationID: req.params.LocationID}, function(err, location){
		if(err)
			res.send(err);
		res.json(location);
	});
};

exports.updateLocation = function(req, res) {
	Location.findOneAndUpdate({LocationID: req.params.LocationID}, function(err, location){
		if(err)
			res.send(err);
		res.json(location);
	});
};

exports.deleteLocation = function(req, res) {
	Location.remove({LocationID: req.params.LocationID}, function(err, location){
		if(err)
			res.send(err);
		res.json(location);
	});
};



// ASSET CONTROLS
exports.listAssets = function(req, res) {
    Asset.find({}, function(err, asset){
	if(err)
	    res.send(err);
	res.json(asset);
    });
};

exports.createAsset = function(req, res) {
    var new_asset = new Asset(req.body);
    new_asset.save(function(err, asset){
		if(err) {
			res.send(err);
		} else {
			hashAfterChange(asset.AssetID)
			.then(data => {
				res.json(asset);
			})
			.catch(function(error) {
				res.send(error);
			});
		}
	});
};

exports.readAsset = function(req, res){
	Asset.find({AssetID: req.params.AssetID}, function(err, asset){
	if(err)
		res.send(err);
	res.json(asset);
	});
};

exports.updateAsset = function(req, res){
	Asset.findOneAndUpdate({AssetID: req.params.AssetID}, req.body, {new: true}, function(err, asset){
		if (err) {
			res.send(err);
		} else {
			hashAfterChange(asset.AssetID)
			.then(data => {
				res.json(asset);
			})
			.catch(function(error) {
				res.send(error);
			});	
		}
	});
};

exports.deleteAsset = function(req, res){
	Asset.remove({AssetID: req.params.AssetID}, function(err, asset){
			if(err)
    			res.send(err);
			res.json({ message: 'Asset successfully deleted'});	
	});
};



// COMPONENT CONTROLS
exports.listComponents = function(req, res) {
    Component.find({}, function(err, component){
	if(err)
	    res.send(err);
	res.json(component);
    });
};

exports.createComponent = function(req, res) {
    var new_component = new Component(req.body);
    new_component.save(function(err, component){
		if (err) {
			res.send(err);
		} else {
			hashAfterChange(component.AssetID)
			.then(data => {
				res.json(component);
			})
			.catch(function(error) {
				res.send(error);
			});	
		}
	});
};

exports.readComponent = function(req, res){
	Component.findOne({ComponentID: req.params.ComponentID}, function(err, component){
	if(err)
    	res.send(err);
	res.json(component);
	});
};

exports.updateComponent = function(req, res){
	Component.findOneAndUpdate({ComponentID: req.params.ComponentID}, req.body, {new: true}, function(err, component){
		if (err) {
			res.send(err);
		} else {
			hashAfterChange(component.AssetID)
			.then(data => {
				res.json(component);
			})
			.catch(function(error) {
				res.send(error);
			});	
		}
	});
};

exports.deleteComponent = function(req, res){
	Component.remove({ComponentID: req.params.ComponentID}, function(err, component){
		if(err)
    		res.send(err);
		res.json({ message: 'Component successfully deleted'});	
	});
};



//OBSERVATION CONTROLS
exports.listObservations = function(req, res) {
    Observation.find({}, function(err, observation){
	if(err)
	    res.send(err);
	res.json(observation);
    });
};

exports.createObservation = function(req, res) {
    var new_observation = new Observation(req.body);
    new_observation.save(function(err, observation){
		if (err) {
			res.send(err);
		} else {
			identifyObsAsset(observation.ConnectionCodeID)
			.then(assetId => {
				hashAfterChange(assetId)
				.then(data => {
					res.json(observation);
				})
				.catch(function(err) {
					res.send(err);
				});
			})
			.catch(function(err) {
				res.send(err);
			});
		}
	});
};

/* Returns json of an observation based on the observationId parameter.
 *  @return {Array} observation that matches the observationId parameter
*/ 
exports.readObservation = function(req, res){
	Observation.findOne({ObservationID: req.params.ObservationID}, function(err, observation){
	if(err)
    	res.send(err);
	res.json(observation);
	});
};

// Updates an existing object in the database
exports.updateObservation = function(req, res){
	Observation.findOneAndUpdate({ObservationID: req.params.ObservationID}, req.body, {new: true}, function(err, observation){
		if (err) {
			res.send(err);
		} else {
			identifyObsAsset(observation.ConnectionCodeID)
			.then(assetId => {
				hashAfterChange(assetId)
				.then(data => {
					res.json(observation);
				})
				.catch(function(err) {
					res.send(err);
				});
			})
			.catch(function(err) {
				console.log(err);
			});
		}
	});
};

// Deletes an observation from the database
exports.deleteObservation = function(req, res){
	Observation.remove({ObservationID: req.params.ObservationID}, function(err, observation){
		if(err)
    		res.send(err);
		res.json({ message: 'Observation successfully deleted'});	
	});
};



// CONNECTIONCODE CONTROLS
exports.listConnectionCodes = function(req, res){
    ConnectionCode.find({}, function(err, connectioncodes){
	if(err)
	    res.send(err);
	res.json(connectioncodes);
    });
};

exports.createConnectionCode = function(req, res){
    var new_connectioncode = new ConnectionCode(req.body);
    new_connectioncode.save(function(err, connectioncode){
	if(err)
    	res.send(err);
	res.json(connectioncode);
	});
};

/* Returns json of an connectioncode based on the connectioncodeId parameter.
 *  @return {Array} connectioncode that matches the connectioncodeId parameter
*/ 
exports.readConnectionCode = function(req, res){
	ConnectionCode.findOne({ConnectionCodeID: req.params.ConnectioncodeID}, function(err, connectioncode){
	if(err)
    	res.send(err);
	res.json(connectioncode);
	});
};

// Updates an existing object in the database
exports.updateConnectionCode = function(req, res){
	ConnectionCode.findOneAndUpdate({ConnectionCodeID: req.params.ConnectioncodeID}, req.body, {new: true}, function(err, connectioncode){
	if(err)
    	res.send(err);
	res.json(connectioncode);		
	});
};

// Deletes an connectioncode from the database
exports.deleteConnectionCode = function(req, res){
	ConnectionCode.remove({ConnectionCodeID: req.params.ConnectionCodeID}, function(err, connectioncode){
		if(err)
    		res.send(err);
		res.json({ message: 'ConnectionCode successfully deleted'});	
	});
};



// SAMPLEPOINT CONTROLS
exports.listSamplePoints = function(req, res){
    SamplePoint.find({}, function(err, samples){
	if(err)
	    res.send(err);
	res.json(samples);
    });
};

exports.createSamplePoint = function(req, res){
    var new_sample = new SamplePoint(req.body);
    new_sample.save(function(err, sample){
	if(err)
    	res.send(err);
	res.json(sample);
	});
};

/* Returns json of an sample based on the sampleId parameter.
 *  @return {Array} sample that matches the sampleId parameter
*/ 
exports.readSamplePoint = function(req, res){
	SamplePoint.findOne({SamplePointID: req.params.SamplePointID}, function(err, sample){
	if(err)
    	res.send(err);
	res.json(sample);
	});
};

// Updates an existing object in the database
exports.updateSamplePoint = function(req, res){
	SamplePoint.findOneAndUpdate({SamplePointID: req.params.SamplePointID}, req.body, {new: true}, function(err, sample){
	if(err)
    	res.send(err);
	res.json(sample);		
	});
};

// Deletes an sample from the database
exports.deleteSamplePoint = function(req, res){
	SamplePoint.remove({SamplePointID: req.params.SamplePointID}, function(err, sample){
		if(err)
    		res.send(err);
		res.json({ message: 'SamplePoint successfully deleted'});	
	});
};



/*
 *	Get request that returns all Assets, Components, and listObservations that match the request 
 *	parameter AssetID.
 *	@params (AssetID): The field inside the database that links components and connectioncodes to an object
 *	@returns: json array containing all matches inside the asset, component and connectioncode objects
*/
exports.listAllByAssetID = function(req, res){
	var result = []; //Array to push all the matching json objects into

	Asset.find({AssetID: req.params.AssetID}, function(err, asset){
		if(err)
			res.send(err);
		if (asset.length > 0) {
			result.push({asset});

			Location.find({LocationID: asset[0].LocationID}, function(err, location) {
				if(err)
					res.send(err);
				if (location.length > 0) {
					result.push({location});

					Site.find({SiteID: location[0].SiteID}, function(err, site) {
						if(err)
							res.send(err);
						if (site.length > 0) {
							result.push({site});
					
							Component.find({AssetID: req.params.AssetID}, function(err, components){
								if(err)
									res.send(err);
								if (components.length > 0) {
									result.push({components});

									var compIDs = [];
									for (var i = 0; i < components.length; i++) {
										compIDs.push(components[i].ComponentID);
									}
						
									SamplePoint.find({ComponentID: {$in: compIDs}}, function(err, samplepoints){
										if(err)
											res.send(err);
										// Run if there are matching Sample Points
										if(samplepoints.length > 0){
											var spIDs = [];
											for (var i = 0; i < samplepoints.length; i++) {
												spIDs.push(samplepoints[i].SamplePointID);
											}

											ConnectionCode.find({SamplePointID: {$in: spIDs}}, function(err, connectioncodes){
												if(err)
													res.send(err);
												//Run if there are matching Connection ID's
												if(connectioncodes.length > 0){
													var ccIDs = [];
													for (var i = 0; i < connectioncodes.length; i++) {
														ccIDs.push(connectioncodes[i].ConnectionCodeID);
													}

													Observation.find({ConnectionCodeID: {$in: ccIDs}}, function(err, observations){
														if(err)
															res.send(err);
														result.push({observations});
														res.json(result);
													});
												}
												//Respond to no matching ConnectionIDs with an empty observations array
												else{
													console.log("No connection codes");
													Observation.find({ConnectionCodeID: -1}, function(err, observations){
														if(err)
															res.send(err);
														result.push({observations});
														res.json(result);
													});
												}
											});
										}
										// Respond to no matching SamplePoints with an empty observations array
										else{
											console.log("No sample points");
											Observation.find({ConnectionCodeID: -1}, function(err, observations){
												if(err)
													res.send(err);
												result.push({observations});
												res.json(result);
											});
										}
									});
								} else {
									result.push({components});
									res.json(result);
								}
							});
						} else {
							result.push({site});
							res.json(result);
						}
					});
				} else {
					result.push({location});
					res.json(result);
				}
			});
		} else {
			result.push({asset});
			res.json(result);
		}
	});
};



/* 
	Slightly modified 'listAllByAssetID' to serve 'getEverthing' below.
	(returns promise, and res.json calls replaced with resolve calls)
*/
var listAllByAssetID2 = function(assetID) {
	return new Promise(function(resolve, reject) {
		try {
			var result = []; //Array to push all the matching json objects into

			Asset.find({AssetID: assetID}, function(err, asset){
				if(err)
					console.log(err);
				if (asset.length > 0) {
					result.push({asset});
		
					Location.find({LocationID: asset[0].LocationID}, function(err, location) {
						if(err)
							console.log(err);
						if (location.length > 0) {
							result.push({location});
		
							Site.find({SiteID: location[0].SiteID}, function(err, site) {
								if(err)
									console.log(err);
								if (site.length > 0) {
									result.push({site});

									Component.find({AssetID: assetID}, function(err, components){
										if(err)
											console.log(err);
										if (components.length > 0) {
											result.push({components});
						
											var compIDs = [];
											for (var i = 0; i < components.length; i++) {
												compIDs.push(components[i].ComponentID);
											}
								
											SamplePoint.find({ComponentID: {$in: compIDs}}, function(err, samplepoints){
												if(err)
													console.log(err);
												// Run if there are matching Sample Points
												if(samplepoints.length > 0){
													var spIDs = [];
													for (var i = 0; i < samplepoints.length; i++) {
														spIDs.push(samplepoints[i].SamplePointID);
													}
						
													ConnectionCode.find({SamplePointID: {$in: spIDs}}, function(err, connectioncodes){
														if(err)
															console.log(err);
														//Run if there are matching Connection ID's
														if(connectioncodes.length > 0){
															var ccIDs = [];
															for (var i = 0; i < connectioncodes.length; i++) {
																ccIDs.push(connectioncodes[i].ConnectionCodeID);
															}
						
															Observation.find({ConnectionCodeID: {$in: ccIDs}}, function(err, observations){
																if(err)
																	console.log(err);
																result.push({observations});
																resolve(result);
															});
														}
														//Respond to no matching ConnectionIDs with an empty observations array
														else{
															console.log("No connection codes");
															Observation.find({ConnectionCodeID: -1}, function(err, observations){
																if(err)
																	console.log(err);
																result.push({observations});
																resolve(result);
															});
														}
													});
												}
												// Respond to no matching SamplePoints with an empty observations array
												else{
													console.log("No sample points");
													Observation.find({ConnectionCodeID: -1}, function(err, observations){
														if(err)
															console.log(err);
														result.push({observations});
														resolve(result);
													});
												}
											});
										} else {
											result.push({components});
											resolve(result);
										}
									});
									
								} else {
									result.push({site});
									resolve(result);
								}
							});
						} else {
							result.push({location});
							resolve(result);
						}
					});
				} else {
					result.push({asset});
					resolve(result);
				}
			});
		} catch(err) {
			resolve(err);
		}

	});
}



/* 
	Return the response of listAllByAssetID2 as a Promise
*/
var getAll = function(assetID) {
	return  new Promise(function(resolve, reject) {
		try {
			listAllByAssetID2(assetID)
			.then(result => {
				resolve(result);
			});
			
		} catch(err) {
			resolve(err);
		}
	})
}



/* 
	Get request returns JSON with all Assets (inc. Site and Location) along with the Components for each Asset
	and the Observations for each Component
*/
exports.getEverything = function(req, res) {
	var allAssets = [];

	Asset.find({}, function(err, assets) {
		if (err)
			res.send(err);
		if (assets.length > 0) {
			assets.forEach(function(asset, index) {
				getAll(asset.AssetID)
				.then(assetResult => {
					return new Promise(function(resolve, reject){
						try {
							allAssets.push({assetResult});
							console.log("\n" + allAssets);
							if (allAssets.length == assets.length)
								resolve(allAssets);
						} catch(err) {
							resolve(err);
						}
					});
				})
				.then(allAssets => {
					res.json(allAssets);
				})
				.catch(function(err){
					res.json(err);
				});
			});
		} else {
			allAssets.push({assets});
			res.json(allAssets);
		}
	});
};