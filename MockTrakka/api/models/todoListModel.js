/* Author Ian Maskell

Minor additions: Douglas Kumar
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Site Model Schema
var SiteSchema = new Schema({
    SiteID: {
        type: Number,
        required: 'Enter the site ID'
    }
});

// Location Model Schema
var LocationSchema = new Schema({
    LocationID: {
        type: Number,
        required: 'Enter the location ID'
    },
    Location: {
        type: String,
        required: 'Enter the name of the Location'
    },
    Notes: {
        type: String
    },
    SiteID: {
        type: Number,
        required: 'Enter the site ID'
    }
});

// Asset Model Schema
var AssetSchema = new Schema({
    Asset: {
        type: String,
        required: 'Enter name of Asset'
    },
    AssetID: {
        type: Number,
        required: 'Enter the asset ID'
    },
    AssetModelID: {
        type: Number,
        required: 'Enter the Asset Model Id'
    },
    DateInService: {
        type: Date,
        default: Date.now
    },
    Description: {
        type: String,
    },
    LocationID: {
        type: Number,
        required: 'Enter the Asset\'s location ID'
    },
    Notes: {
        type: String,
    },
    OperatingEnvironmentID: {
        type: Number,
        required: 'Enter the Assets\'s operating environment Id'
    },
    SerialNumber: {
        type: String,
        required: 'Enter the Asset\'s serial number'
    },
    WarrantyExpiration: {
        type: Date,
        default: Date.time
    }
});



// Component Model Schema
var ComponentSchema = new Schema({
    AssetID: {
        type: Number,
        required: 'Enter the Asset ID for the component'
    },
    Component: {
        type: String,
        required: 'Enter the name of the component'
    },
    ComponentID: {
        type: Number,
        required: 'Enter the components ID'
    },
    ComponentModelID: {
        type: Number,
        required: 'Enter the components model ID'
    },
    ComponentName: {
        type: String,
        required: 'Enter the name of the component'
    },
    DateInService: {
        type: Date,
        default: Date.time
    },
    DefaultLabFormatID: {
        type: Number,
        required: 'Enter the DefaultLabFormatID'
    },
    Description: {
        type: String
    },
    NewestMeterErrorDaySite: {
        type: Date,
        default: Date.time
    },
    NewestMeterErrorTimeSite: {
        type: String
    },
    Notes: {
        type: String
    },
    OldestMeterErrorDaySite: {
        type: Date,
        default: Date.time
    },
    SerialNumber: {
        type: String,
        required: 'Enter the serial number of the component'
    },
    TrackKPIs: {
        type: Boolean,
    },
    WarrantyExpiration: {
        type: Date,
        default: Date.time
    }
});


// Observation Model Schema
var ObservationSchema = new Schema({
    ObservationID: {
        type: Number,
        required: 'Enter the ID of the Observation'
    },
    ObservationTypeID: {
        type: Number,
        required: 'Enter the ID of the Observation Type'
    },
    ConnectionCodeID: {
        type: Number,
        required: 'Enter the Connection Code ID'
    },
    MeterReading: {
        type: Number,
        required: 'Enter the current meter reading'
    },
    ObservationDaySite: {
        type: Date,
        default: Date.time
    },
    ObservationCode: {
        type: String,
        required: 'Enter the Observation Code'
    },
    ImportID: {
        type: Number,
        required: 'Enter the Import ID'
    },
    ObservationExceptionLevelID: {
        type: Number,
        required: 'Enter Observation Exception Level ID'
    },
    TrakkaExceptionLevelID: {
        type: Number,
        required: 'Enter Trakka Exception Level ID'
    },
    InTheInbox: {
        type: Boolean,
    },
    ObservationInformation: {
        type: String,
    },
    ObservationComment: {
        type: String,
    },
    DataSourceID: {
        type: Number,
        required: 'Enter the Data Source ID'
    },
    MeterEventID: {
        type: Number,
        required: 'Enter the Meter Event ID'
    },
    DataErrorCode: {
        type: String
    },
    UpdateNum: {
        type: Date,
        default: Date.time
    },
    SiteID: {
        type: Number,
        required: 'Enter the Site ID'
    },
    UpdateUserID: {
        type: Number,
        required: 'Enter the Update User ID'
    },
    Created: {
        type: Date,
        default: Date.time
    },
    Updated: {
        type: Date,
        default: Date.time
    },
    Deleted: {
        type: Number
    },
    DeletedFlag: {
        type: Boolean
    },
    ObservationTimeSite: {
        type: Date,
        default: Date.time
    },
    Observation: {
        type: String,
    }

});

var ConnectionCodeSchema = new Schema({
    ConnectionCodeID: {
        type: Number,
        required: 'Enter the ConnectionCodeID'
    },
    SamplePointID: {
        type: Number,
        required: 'Enter the SamplePointID'
    }
});

var SamplePointSchema = new Schema({
    SamplePointID: {
        type: Number,
        required: 'Enter the SamplePointID'
    },
    ComponentID: {
        type: Number,
        required: 'Enter the ComponentID'
    }
});

module.exports = mongoose.model('Site', SiteSchema),
                 mongoose.model('Location', LocationSchema),
                 mongoose.model('Asset', AssetSchema),
                 mongoose.model('Component', ComponentSchema),
                 mongoose.model('Observation', ObservationSchema),
                 mongoose.model('ConnectionCode', ConnectionCodeSchema),
                 mongoose.model('SamplePoint', SamplePointSchema);
