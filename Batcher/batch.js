const http = require('http');
const request = require('request-promise');

const port = 3009;
const host = 'localhost'; // change for cloud deployment
// 1 hour
const intervalTimeHour = 3600000;
// 5 seconds
const intervalTime = 5000;
var counter = 0;

var custdb_add = 'https://cust-db.glitch.me/readyhashes';
var counts = [];

// print hello to the console every 3 seconds (3000 milliseconds)
// this is a substitute for the actual batching process - proper batching thing goes here ->
// PROPER BATCH PROGRAM ADDED (see below)
var interval = setInterval( () => {
counter = counter + (intervalTime / 1000);

// START OF BATCH PROGRAM

// Get all readyhashes currently in the custom database
request(custdb_add, function(error, response, readyhashes) {
})
.then(readyhashes => {

    try {
        var jsonRH = JSON.parse(readyhashes);
    } catch(err) {
        console.log(err);
    }

    // Create a new block in fabric for each readyhash entry in the custom databse
    jsonRH.forEach(function(readyhash, index) {
        
        // Find the block count for the readyhash's Asset
        var assetId = readyhash.AssetID;
        var address = "https://mock-fabric.glitch.me/ledger/" + assetId;
        console.log(address);
        request(address, function(err, res, blocks){
        })
        .then(blocks => {
            try {
                var assetBlocks = JSON.parse(blocks);
                console.log("assetBlocks: " + assetBlocks);
            } catch(err) {
                console.log(err);
            }
            if (assetBlocks.length > 0) {
                assetBlocks.forEach(function(block, index) {
                    counts.push(block.AssetBlockCount);
                });
                var blockCount = Math.max(...counts);
                console.log("counts: " + counts);
                console.log("blockCount: " + blockCount);
                counts = [];
            } else {
                var blockCount = -1;
                console.log("counts: " + counts);
                console.log("blockCount: " + blockCount);
            }
            
            // Set the new block's block count to current block count plus one
            var blockData = {
                'AssetID': readyhash.AssetID,
                'AssetBlockCount': (blockCount + 1),
                'Hash': readyhash.Hash
            };
            
            // Send the new block to fabric
            request({
                url: "https://mock-fabric.glitch.me/ledger",
                method: "POST",
                json: true,
                body: blockData
            }, function (err, res, body){
                console.log('\nstatusCode: \n', res && res.statusCode);
                console.log("\nbody: \n" + body);
            })
            .then(function(body){
                console.log(body);
                console.log("\n\nINDEX: " + index + "\n\n");

                // After creating the all the new blocks in fabric, clear the custom database
                if (index == (jsonRH.length - 1)) {
                    request({
                        url: "https://cust-db.glitch.me/readyhashes",
                        method: "DELETE",
                        json: true
                    }, function (err, res, body){
                        console.log('\nstatusCode: \n', res && res.statusCode);
                        console.log("\nbody: \n" + body);
                    })
                    .then(function(body){
                        console.log(body);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        })
        .catch(function(err){
            console.log(err);
        });
    });
})
.catch(function(err) {
    console.log(err);
});

console.log("Process executed at " + counter + " seconds\n-----------------------------------------\n\n") }, intervalTime);

/* http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`${interval} Batching page`);
}).listen(port);

console.log(`Server running on ${host}:${port}`); */