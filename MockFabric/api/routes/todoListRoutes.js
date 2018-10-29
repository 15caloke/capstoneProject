/* 
Author: Douglas Kumar
Date: October 2018
*/

'use strict';

module.exports = function(app) {
    var fabric = require('../controllers/todoListController');

    // BLOCK ROUTES
    app.route('/ledger')
        .get(fabric.listBlocks)
        .post(fabric.createBlock)
        //.delete(fabric.clearBlocks); // REMOVE THIS ROUTE

    /* app.route('/ledger/:AssetBlockCount')
        .get(fabric.readBlock)
        .put(fabric.updateBlock)
        .delete(fabric.deleteBlock); */

    app.route('/ledger/:AssetID')
        .get(fabric.findByAssetID);

    app.route('/ledger/:AssetID/:Count')
        .get(fabric.findByAssetIDCount);
};