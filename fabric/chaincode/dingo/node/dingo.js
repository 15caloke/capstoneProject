'use strict'; // will throw exceptions at errors and be stricter on functionality
const fabricShim = require('fabric-shim');
const util = require('util');
const request = require('request');
const OK = 200;
const ASSETS = 0, COMPONENTS = 1, OBSERVATIONS = 2;
/*
 * Chaincode script for Dingo Asset Provinence Data Blockchain Manipulation
 * These functions are used to interact with fabric blockchain technology
 * 
 * NOTE: WIP, no method of testing since npm execution fails with npm code
 * 
 * Date: 13/09/2018
 * Author: U.E.
 * 
 * Links to fetch data from:
 * http://dingo-ue.us.openode.io/assets
 * http://dingo-ue.us.openode.io/components
 * http://dingo-ue.us.openode.io/observations
 */
const Chaincode = class {
    //TODO: Needs Reviewing
    async Init(stub) {
        console.log("====================== DINGO BC Initialized ===========================");
        try {
            let args = stub.getFunctionAndParameters();
            if (args.length != 2) {
                throw new Error('Need a Key (arg1) and Value (arg2) pair');
            }
            let key = args[0];
            let val = args[1];
            let byteData = await stub.putState(key, Buffer.from(val));
            if (byteData == null || byteData.length <= 0) {
                throw Error('No valid data');
            }
            return shim.success(byteData);
            // return shim.success(Buffer.from(
            //     '====================== DINGO BC Initialized ==========================='
            // ));
        } catch (e) {
            console.log(e);
            return shim.error(e);
        }
    } // end Init

    //TODO: Needs Reviewing
    async Invoke(stub) {
        try {
            let ret = stub.getFunctionAndParameters();
            console.info(ret);

            let method = this[ret.fcn];
            if (!method) {
                console.error('no function of name:' + ret.fcn + ' found');
                throw new Error('Received unknown function ' + ret.fcn + ' invocation');
            }
            let payload = await method(stub, ret.params);
            return shim.success(payload);
        } catch (e) {
            console.log(e);
            return shim.error(e);
        }
    } // end Invoke

    /*
    async Invoke(stub) {
        // TODO: use the invoke input arguments to decide intended changes

        // retrieve existing chaincode states
        let oldValue = await stub.getState(key);

        // calculate new state values and saves them
        let newValue = oldValue + delta;
        await stub.putState(key, Buffer.from(newValue));

        return shim.success(Buffer.from(newValue.toString()));
    }
    */

    async initLedger(stub) {
        console.log("==== Starting Ledger initialisation ====\n");

        // Get the assets from the Custom DB
        let assetPromise = new Promise((resolve, reject) => {
            let assetLink = `http://dingo-ue.us.openode.io/assets`;
            let assets = [];
            request(assetLink, (error, response, body) => {
                if (!error && response.statusCode === OK) {
                    let info = JSON.parse(body);
                    assets.push(info);
                    // console.log('---------------');
                    // console.log(assets);
                    resolve(assets); // can pass info to reduce an array, if so, do for all entities
                } else {
                    reject(error);
                }
            });
        });
        // Get the components from the Custom DB
        let compPromise = new Promise((resolve, reject) => {
            let componentsLink = `http://dingo-ue.us.openode.io/components`;
            let components = [];
            request(componentsLink, (error, response, body) => {
                if (!error && response.statusCode == OK) {
                    let info = JSON.parse(body);
                    components.push(info);
                    // console.log('-----------------');
                    // console.log(components);
                    resolve(components);
                } else {
                    reject(error);
                }
            });
        })
        // Get the observations from the Custom DB
        let obsPromise = new Promise((resolve, reject) => {
            let observationsLink = `http://dingo-ue.us.openode.io/observations`;
            let observations = [];
            request(observationsLink, (error, response, body) => {
                if (!error && response.statusCode === OK) {
                    let info = JSON.parse(body);
                    observations.push(info);
                    // console.log('-----------------');
                    // console.log(observations);
                    resolve(observations);
                } else {
                    reject(error);
                }
            });
        });

        // Do after completing all requests
        Promise.all([assetPromise, compPromise, obsPromise]).then((values) => {
            console.log('------------------- Writing Ledger ------------------------');
            // for debugging purposes
            for (let i = 0; i < values.length; i++) {
                for (let j = 0; j < values[i].length; j++) {
                    for (let k = 0; k < values[i][j].length; k++) {
                        // comment line below out when testing via console
                        stub.putState('Entity: ' + values[i][j][k]._id, Buffer.from(JSON.stringify(values[i][j][k])));
                        console.log(`Added Entity Type: ${values[i][j][k]._id}`);
                    }
                }
            }
        }).then(() => {
            console.log("\n==== Finished Ledger initialisation ====");
        }).catch((e) => {
            console.log(e);
        });
    } // end of initLedger

    async queryObj(stub, args) {
        try {
            if (args.length != 1) {
                throw new Error('Can only query one Asset, please enter one AssetID');
            }
            let objIDQueried = args[0];
            let byteObjData = await stub.getState(objIDQueried);

            if (!byteObjData || byteObjData.toString().length <= 0) {
                throw new Error(objIDQueried + ' does not exist: ');
            }
            console.log(byteObjData.toString());
            return byteObjData;
        } catch (e) {
            console.log(e);
        }
    } // end of queryObj

    async queryAllObjs(stub) {
        let startKey = 000000000000000000000000;
        let endKey = 999999999999999999999999;
        let iterator = await stub.getStateByRange(startKey, endKey);

        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return Buffer.from(JSON.stringify(allResults));
            }
        }
    }

    async changeComponent(stub, args) {
        console.log('============= Intialising Ownership Transaction ===========');
        try {
            if (args.length != 2) {
                throw new Error('Incorrect number of arguments. Expecting 2');
            }
            let componentAsBytes = await stub.getState(args[0]);
            let component = await JSON.parse(componentAsBytes);
            // changing component properties
            component[0].Component = args[1];
            component[0].ComponentName = args[1]; // Might derive from an ID?

            await stub.putState(args[0], Buffer.from(JSON.stringify(component)));
            console.log('============= Finished Transactions ===========');
        } catch (e) {
            console.log(e);
        }
    }
}
// Start the chaincode process and listen for incoming endorsement requests
fabricShim.start(new Chaincode());
