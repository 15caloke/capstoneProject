/* 
    Tests to ensure the hashing and filtering functions process data in trakka format
    correctly and produce hashes in string type

    Author: Douglas Kumar
    Date: August 2018
*/

const hashingFunctions = require('./hashing_functions');
const filterFunctions = require('../filtering/filtering_function');
const rest = require('../../app/rest');
const request = require('request');
var EventEmitter = require('events').EventEmitter;

/* -------------------- Test Code -------------------- */

/* ---------- After filtering function ---------- */

// FROM stackoverflow, didn't work...
/* var url = "http://localhost:3000/assets";

http.get(url, function(res){
    var body = '';

    res.on('data', funciton(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse.picture);
    });
}).on('error', function(e){
    console.log("Got an error: ", e);
});

var body = new EventEmitter();
var assetID = 5;
var data;

rest.getHashablesFromREST(function(result){
    body.data = result;
    body.emit('update');
}, assetID);

body.on('update', function() {
    console.log(body.data);
});

console.log(data); */

//// IMPORTANT: Had to hardcode the listallbyassetid response due to not
//              being able to store the result of the function in rest.js
//              locally and parsing it to filterFunctions. TODO: Will have
//              to work out how to get the response working.
var response = [
    {
        "assets": [
            {
                "_id": "5b6d1add1b9a3a302bd34ad3",
                "SerialNumber": "0001",
                "OperatingEnvironmentID": 2,
                "LocationID": 3,
                "AssetModelID": 4,
                "AssetID": 5,
                "Asset": "Big Truck",
                "DateInService": "2018-08-10T04:55:57.482Z",
                "__v": 0
            }
        ]
    },
    {
        "components": [
            {
                "_id": "5b72783c21d316368fef68e8",
                "SerialNumber": "00000",
                "DefaultLabFormatID": 11111,
                "ComponentName": "Engine",
                "ComponentModelID": 22222,
                "ComponentID": 33333,
                "Component": "Engine2",
                "AssetID": 5,
                "__v": 0
            }
        ]
    },
    {
        "observations": [
            {
                "_id": "5b797f49b6939442d2631952",
                "UpdateUserID": 1,
                "SiteID": 1,
                "MeterEventID": 1,
                "DataSourceID": 1,
                "TrakkaExceptionLevelID": 1,
                "ObservationExceptionLevelID": 1,
                "ImportID": 1,
                "ObservationCode": "1",
                "MeterReading": 1,
                "ObservationTypeID": 1,
                "ObservationID": 1,
                "ConnectionCodeID": 1,
                "__v": 0
            },
            {
                "_id": "5b797f64b6939442d2631953",
                "UpdateUserID": 1,
                "SiteID": 1,
                "MeterEventID": 1,
                "DataSourceID": 1,
                "TrakkaExceptionLevelID": 1,
                "ObservationExceptionLevelID": 1,
                "ImportID": 1,
                "ObservationCode": "1",
                "MeterReading": 1,
                "ObservationTypeID": 1,
                "ObservationID": 2,
                "ConnectionCodeID": 1,
                "__v": 0
            },
            {
                "_id": "5b797f8cb6939442d2631954",
                "UpdateUserID": 1,
                "SiteID": 1,
                "MeterEventID": 1,
                "DataSourceID": 1,
                "TrakkaExceptionLevelID": 1,
                "ObservationExceptionLevelID": 1,
                "ImportID": 1,
                "ObservationCode": "1",
                "MeterReading": 1,
                "ObservationTypeID": 1,
                "ObservationID": 1,
                "ConnectionCodeID": 1,
                "__v": 0
            },
            {
                "_id": "5b797fcbb6939442d2631956",
                "UpdateUserID": 1,
                "SiteID": 1,
                "MeterEventID": 1,
                "DataSourceID": 1,
                "TrakkaExceptionLevelID": 1,
                "ObservationExceptionLevelID": 1,
                "ImportID": 1,
                "ObservationCode": "1",
                "MeterReading": 1,
                "ObservationTypeID": 1,
                "ObservationID": 1,
                "ConnectionCodeID": 1,
                "__v": 0
            }
        ]
    }
];

var textData = filterFunctions.convertObjToString(response);
console.log(textData);
var hash = hashingFunctions.generateHash(textData);
console.log(hash);

/* // console.log(generateHash("00001"));

var assethash = hashingFunctions.generateHash("00001");
var componenthash = hashingFunctions.generateHash("00001");
var observationhash = hashingFunctions.generateHash("00001");

//// This code concats all the hashes before running multiHash ////
var input = "";
input = input.concat(assethash, componenthash, observationhash);
console.log(input);

var encrypted = hashingFunctions.multiHash(input);
////////////////////////////////////////////////////////////////

var encrypted_verify = hashingFunctions.multiHash(assethash, componenthash, observationhash);

// Check that inputting a single concatenated hash 
// produces the same result as inputting hashes separately.
hashingFunctions.compareHashes(encrypted, encrypted_verify); */

/* ---------- After handling json object input ---------- */

/* var asset = {
    "_id": "5b66f",
    "Asset": "111",
    "SerialNumber": "222",
    "AssetModelId": 333,
    "AssetID": 123,
    "LocationID": 234,
    "OperatingEnvironmentId": 999,
    "DateInService": "2018-08-05T13:36:33.391Z",
    "__v": 0
};

console.log(typeof(asset));

var asset_s = '{"_id": "5b66f", "Asset": "111", "SerialNumber": "222", "AssetModelId": 333, "AssetID": 123, "LocationID": 234, "OperatingEnvironmentId": 999, "DateInService": "2018-08-05T13:36:33.391Z", "__v": 0}';
console.log(typeof(asset_s));

// These two lines should produce the same console output
var asset_hash = hashingFunctions.generateHash(asset);
var asset_s_hash = hashingFunctions.generateHash(asset_s);
// These two should do the same, as identical strings have been hashed
console.log(asset_hash);
console.log(asset_s_hash);

// This line should cause an error to be thrown if uncommented
// because a number type is not accepted as valid input.
// Only string or object input is handled.
// var blah = hashingFunctions.generateHash(12345);

var final_hash = hashingFunctions.multiHash("", asset_hash);
console.log("\n" + final_hash);

var assets = [
    {
        "_id": "5b66f",
        "Asset": "111",
        "SerialNumber": "222",
        "AssetModelId": 333,
        "AssetID": 123,
        "LocationID": 234,
        "OperatingEnvironmentId": 999,
        "DateInService": "2018-08-05T13:36:33.391Z",
        "__v": 0
    },
    {
        "_id": "6c77g",
        "Asset": "112",
        "SerialNumber": "223",
        "AssetModelId": 334,
        "AssetID": 124,
        "LocationID": 235,
        "OperatingEnvironmentId": 9991,
        "DateInService": "2018-08-05T13:36:33.391Z",
        "__v": 0
    },
    {
        "_id": "6c77h",
        "Asset": "112",
        "SerialNumber": "223",
        "AssetModelId": 334,
        "AssetID": 124,
        "LocationID": 235,
        "OperatingEnvironmentId": 9991,
        "DateInService": "2018-08-05T13:36:33.391Z",
        "__v": 0
    }
];

console.log("\n" + typeof(assets));
console.log(asset.length); */

/* ------------------------------------------------------ */