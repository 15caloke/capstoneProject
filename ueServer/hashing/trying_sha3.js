/* 
    Author: Douglas Kumar
    Date: August 2018
*/

const SHA3 = require('sha3');

// Edit the strings to test whether generated 
// hashes match for identical strings.
var data = "00001";
var data2 = "00001";

// Default hashlen is 512-bit
var a = new SHA3.SHA3Hash(256);
var b = new SHA3.SHA3Hash(256);

a.update(data, 'ascii');
b.update(data2, 'ascii');
var hash1 = a.digest('hex');
var hash2 = b.digest('hex');

if (hash1.localeCompare(hash2) == 0) {
    console.log("The hashes match.")
} else {
    console.log("The hashes do not match.")
}

console.log("Hash 1: " + hash1);
console.log("Hash 2: " + hash2);