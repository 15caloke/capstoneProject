// Import express
const express = require('express');
const app = express();
// Define URL properties
const port = process.env.PORT || 3007;
const rest = require('./rest');
// Other required modules
const api = require('./api_functions');

// Enable CORS on server-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

// Server App setup actions //

var welcome = "Welcome to the UE API.\n\nUse /prepare/:AssetID in the URL to send a new hash for the asset.\n\nThis process should be automated after the case, 'Triggers...', is complete.";

app.get('/', (req, res) => {
    res.send(welcome);
});

app.get('/resttest', (req,res) => {
	var assetID = 1;
	rest.getHashablesFromREST(function(result){
		if(result instanceof Error)
			res.send("The server is not available so the request was not handled");
		else
			res.json(result);
	}, assetID);
});

app.get('/prepare/:AssetID', (req,res) => {
	api.prepareNewHash(req.params.AssetID)
	.then(reqResult => {
		console.log("\nreqResult: \n" + reqResult);
		res.json(reqResult);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.get('/check/:AssetID', (req, res) => {
	api.check(req.params.AssetID)
	.then(reqResult => {
		res.json(reqResult);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.listen(port);

console.log('UE API REST server started on: ' + port);