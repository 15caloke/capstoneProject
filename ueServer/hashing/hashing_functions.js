/* 
 * Functions for producing and processing hashes from trakka data
 * 
 * Author: Douglas Kumar (Unhandled Exceptions)
 * Date: August 2018
 * 
 */

module.exports = {
    // NO LONGER NEEDED, FACILITY PROVIDED BY FILTERING FUNCTIONS
    // convertToString: concatenate all json field values into a single string
    /* convertToString: function(json_data) {
        var processed = "";

        for (i in json_data) {
            processed = processed.concat(json_data[i]);
        }

        return processed;
    }, */

    // generateHash: produce a 256-bit hash from a string input,
    // including the current hash from fabric
    generateHash: function(fabricHash, dataString) {
        var data = fabricHash.concat(dataString);
        console.log("concatenated string: " + data);

        // NOTE: need to run 'npm install sha3' to use SHA3
        const SHA3 = require('sha3');
        var hash = new SHA3.SHA3Hash(256);
        hash.update(data, 'ascii');
        var encrypted = hash.digest('hex');

        return encrypted;
    },

    // NO LONGER NEEDED DUE TO EXCLUSIVELY TAKING ALL FIELDS FROM ALL JSON OBJECTS WITH 'FILTERING FUNCTIONS'
    // multiHash: produce a 256-bit hash from multiple input hash strings
    /* multiHash: function(prevBlockHash = "", assetHash, componentHash = "", observationHash = "", multi = 1) {
        var data = "";
        data = data.concat(prevBlockHash, assetHash, componentHash, observationHash);
        // When creating a multi hash for the first block in a chain
        var encrypted = module.exports.generateHash(data, multi);

        return encrypted;
    }, */

    // compareHashes: check if two input hash strings match or not
    compareHashes: function(hash1, hash2) {
        if (hash1.localeCompare(hash2) == 0) {
            console.log("\nThe hashes match.")
            return true;
        } else {
            console.log("The hashes do not match.")
            return false;
        }
    }
}