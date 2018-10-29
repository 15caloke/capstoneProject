const Request = require('request');
let restAddress = 'http://localhost:3005/listallbyassetid/'

module.exports = {
	getHashablesFromREST: function(callback, idNumber) {
		Request((restAddress + idNumber), {json: true}, (err, res, body) => {
			if(err){
				callback(err);
				return;
			}
			callback(body);
		});	
	}
};