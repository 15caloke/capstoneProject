/* 
    Functions for sending newly created hashes to the intermediate custom database

    Author: Douglas Kumar
    Date: September 2018
*/

const hashFunctions = require('./hashing/hashing_functions');
const filterFunctions = require('./filtering/filtering_function');
var request = require('request-promise');

exports.check = function(assetId) {
    return new Promise(function(resolve, reject) {
        getFabricHash(assetId, true)
        .then(prevFabricHash => {
            getAssetData(assetId)
            .then(assetData => {
                try {
                    var jsonObj = JSON.parse(assetData);
                } catch(err) {
                    reject(err);
                }
                if (jsonObj[0].asset.length > 0) {
                    getFabricHash(assetId)
                    .then(currentFabHash => {
                        if (currentFabHash.localeCompare("") == 0) {
                            reject("This asset has not been instantiated in the ledger.");
                        }
                        var data = filterFunctions.convertObjToString(jsonObj);
                        var hash = hashFunctions.generateHash(prevFabricHash, data);
                        var match = hashFunctions.compareHashes(hash, currentFabHash);
                        var resp = {
                            'AssetID': assetId,
                            'match': match,
                            'generated hash': hash,
                            'fabric hash': currentFabHash
                        };
                        resolve(resp);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                } else {
                    reject("The specified asset doesn't exist.");
                }
            })
            .catch(function(err) {
                reject(err);
            });
        })
        .catch(function(err) {
            reject(err);
        });
    });
}

function getCDBdata() {
    return new Promise(function(resolve, reject) {
        try {
            var rh_address = "https://cust-db.glitch.me/readyhashes";
            request(rh_address, function(error, response, data) {
            })
            .then(function(data){
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

function getAssetData(assetId) {
    return new Promise(function(resolve, reject) {
        try {
            var address = "https://mock-trakka.glitch.me/listallbyassetid/" + assetId;
            request(address, function(error, response, data) {
            })
            .then(function(data){
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

function getFabricHash(assetId, previous = false) {
    return new Promise(function(resolve, reject) {
        try {
            var address = "https://mock-fabric.glitch.me/ledger/" + assetId;
            var counts = [];
            var blockCount;
            request(address, function(error, response, blocks) {
            })
            .then(blocks => {
                try {
                    var assetBlocks = JSON.parse(blocks);
                } catch(err) {
                    console.log(err);
                }
                if (assetBlocks.length > 0) {
                    assetBlocks.forEach(function(block, index) {
                        counts.push(block.AssetBlockCount);
                    });
                    blockCount = Math.max(...counts);
                    counts = [];
                } else {
                    blockCount = -1;
                }

                if (!previous) {
                    var add = "https://mock-fabric.glitch.me/ledger/" + assetId + "/" + blockCount;
                } else {
                    var add = "https://mock-fabric.glitch.me/ledger/" + assetId + "/" + (blockCount-1);
                }

                request(add, function(error, response, block) {
                })
                .then(block => {
                    try {
                        var jsonObj = JSON.parse(block);
                    } catch(err) {
                        reject(err);
                    }
                    if (jsonObj.length > 0) {
                        resolve(jsonObj[0].Hash);
                    } else {
                        resolve("");
                    }
                })
                .catch(function(err) {
                    reject(err);
                })
            })
            .catch(function(err) {
                reject(err);
            })
        } catch(err) {
            reject(err);
        }
    })
}

module.exports.prepareNewHash = function(assetId) {
    return new Promise(function(resolve, reject) {
        try {

            getCDBdata()
            .then(readyhashes => {
                console.log("\nreadyhashes: \n" + readyhashes);
                try {
                    var rhID = (JSON.parse(readyhashes).length) + 1;
                } catch(err) {
                    console.log(err);
                }

                getFabricHash(assetId)
                .then(fabricHash => {

                    getAssetData(assetId)
                    .then(assetData => {
                        console.log("\nassetData: \n" + assetData);
                        try {
                            var jsonObj = JSON.parse(assetData);
                        } catch(err) {
                            reject(err);
                        }
                        if (jsonObj[0].asset.length > 0) {
                            var data = filterFunctions.convertObjToString(jsonObj);
                            console.log("\nDATA: " + data);
                            console.log("fabric hash: " + fabricHash);
                            hash = hashFunctions.generateHash(fabricHash, data);
                            var hashData = {
                                'Hash': hash,
                                'AssetID': assetId,
                                'ReadyHashID': rhID
                            };
                            request({
                                url: "https://cust-db.glitch.me/readyhashes",
                                method: "POST",
                                json: true,
                                body: hashData
                            }, function (err, res, body){
                                console.log('\nstatusCode: \n', res && res.statusCode);
                                console.log("\nbody: \n" + body);
                            })
                            .then(function(body){
                                resolve(body);
                            })
                            .catch(function(err) {
                                reject(err);
                            });
                        } else {
                            reject("The specified asset doesn't exist.");
                        }
                    })
                    .catch(function(err) {
                        reject(err);
                    });

                })
                .catch(function(err) {
                    reject(err);
                });

            })
            .catch(function(err) {
                reject(err);
            });

        } catch(err) {

        }
    });
}

require('make-runnable');