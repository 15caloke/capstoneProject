/* 
Author Ian Maskell
Date: 14 Aug 2018

Minor additions: Calum Oke
*/

'use strict';

module.exports = function(app) {
    var fabHashes = require('../controllers/todoListController');
  
    // Exported Chaincode Hashes ROUTES
    app.route('/hashes')
        .get(fabHashes.listReadyHashes)
        .post(fabHashes.createReadyHash)
        .delete(fabHashes.clearReadyHashes);

    app.route('/hashes/:ReadyHashID')
        .get(fabHashes.readReadyHash)
        .put(fabHashes.updateReadyHash)
        .delete(fabHashes.deleteReadyHash);
}
