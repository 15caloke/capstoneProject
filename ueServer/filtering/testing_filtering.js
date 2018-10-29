const filterfunctions = require('./filtering_function');

// Single JSON Object
var testJsonObj1 = 
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
    };

// Array of JSON objects
var testJsonObj2 = [
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

 // Array of Single JSON Object
 var testJsonObj3 = [
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
    }
 ];

 // Test case 1: Single JSON Object
var results1 = filterfunctions.convertObjToString(testJsonObj1);
console.log(results1);
console.log("\n");


// Test case 2: Array of JSON Objects
var results2 = filterfunctions.convertObjToString(testJsonObj2);
console.log(results2);
console.log("\n");

// Test case 3: Array of Single JSON Object
var results3 = filterfunctions.convertObjToString(testJsonObj3);
console.log(results3);
console.log("\n");