/* 
Author Ian Maskell, Douglas Kumar
Date: Aug 2018
*/

'use strict';

module.exports = function(app) {
    var custdb = require('../controllers/todoListController');

    // READYHASH ROUTES
    app.route('/readyhashes')
        .get(custdb.listReadyHashes)
        .post(custdb.createReadyHash)
        .delete(custdb.clearReadyHashes);

    app.route('/readyhashes/:ReadyHashID')
        .get(custdb.readReadyHash)
        .put(custdb.updateReadyHash)
        .delete(custdb.deleteReadyHash);
};