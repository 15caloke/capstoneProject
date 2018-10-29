/* 
Author Ian Maskell
Date: 14 Aug 2018

Minor additions: Douglas Kumar
*/

'use strict';

module.exports = function(app) {
    var ueREST = require('../controllers/todoListController');

    // SITE ROUTES
    app.route('/sites')
        .get(ueREST.listSites)
        .post(ueREST.createSite);

    app.route('/sites/:SiteID')
        .get(ueREST.readSite)
        .put(ueREST.updateSite)
        .delete(ueREST.deleteSite);

    // LOCATION ROUTES
    app.route('/locations')
        .get(ueREST.listLocations)
        .post(ueREST.createLocation);

    app.route('/locations/:LocationID')
        .get(ueREST.readLocation)
        .put(ueREST.updateLocation)
        .delete(ueREST.deleteLocation);

    // ASSET ROUTES
    app.route('/assets')
        .get(ueREST.listAssets)
        .post(ueREST.createAsset);

    app.route('/assets/:AssetID')
    	.get(ueREST.readAsset)
    	.put(ueREST.updateAsset)
    	.delete(ueREST.deleteAsset);

    // COMPONENT ROUTES
    app.route('/components')
        .get(ueREST.listComponents)
        .post(ueREST.createComponent);

    app.route('/components/:ComponentID')
    	.get(ueREST.readComponent)
    	.put(ueREST.updateComponent)
    	.delete(ueREST.deleteComponent);	

    // OBSERVATION ROUTES
    app.route('/observations')
        .get(ueREST.listObservations)
        .post(ueREST.createObservation);

    app.route('/observations/:ObservationID')
    	.get(ueREST.readObservation)
    	.put(ueREST.updateObservation)
    	.delete(ueREST.deleteObservation);

    //CONNECTIONCODE ROUTES
    app.route('/connectioncodes')
        .get(ueREST.listConnectionCodes)
        .post(ueREST.createConnectionCode);

    app.route('/connectioncodes/:ConnectionCodeID')
        .get(ueREST.readConnectionCode)
        .put(ueREST.updateConnectionCode)
        .delete(ueREST.deleteConnectionCode);

    //SAMPLE ROUTES
    app.route('/samplepoints')
        .get(ueREST.listSamplePoints)
        .post(ueREST.createSamplePoint);

    app.route('/samplepoints/:SamplePointID')
        .get(ueREST.readSamplePoint)
        .put(ueREST.updateSamplePoint)
        .delete(ueREST.deleteSamplePoint);


    // ALLBYASSETID ROUTES
    app.route('/listallbyassetid/:AssetID')
        .get(ueREST.listAllByAssetID);

    // EVERYTHING ROUTES
    app.route('/geteverything')
        .get(ueREST.getEverything);
};
