fetch('https://mock-trakka.glitch.me/geteverything')
.then(response => response.json())
.then(data => {
    var i, j;
    document.getElementById('assets').innerHTML = "";
    
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            document.getElementById('assets').innerHTML += '<li>' + (i+1) + ' | ' + data[i].assetResult[0].asset[0].AssetID + ' - ' + data[i].assetResult[0].asset[0].Asset + '<ul class="aDetails"></ul></li>';
        }
    
        var aD = document.getElementsByClassName('aDetails');
        for (i = 0; i < aD.length; i++) {
            aD[i].innerHTML = '<li><a href="check.html?assetID=' + data[i].assetResult[0].asset[0].AssetID + '">Integrity Check</a></li><li>Serial Number: ' + data[i].assetResult[0].asset[0].SerialNumber + '</li><li>Operating Environment ID: ' + data[i].assetResult[0].asset[0].OperatingEnvironmentID + '</li><li>Location: ' + data[i].assetResult[1].location[0].Location + '</li><li>Site ID: ' + data[i].assetResult[2].site[0].SiteID + '</li><li>Asset Model ID: ' + data[i].assetResult[0].asset[0].AssetModelID + '</li><li>Date In Service: ' + data[i].assetResult[0].asset[0].DateInService + '</li><li>Components<ul class="cDetails"></ul></li><li>Observations<ul class="oDetails"></ul></li>';
        }
    } else {
        document.getElementById('assets').innerHTML += 'There were no assets found in Trakka';
    }

    var cD = document.getElementsByClassName('cDetails');
    for (i = 0; i < cD.length; i++) {
        if ((data[i].assetResult.length > 3) && (data[i].assetResult[3].components.length > 0)) {
            for (j = 0; j < data[i].assetResult[3].components.length; j++) {
                cD[i].innerHTML += '<li>' + data[i].assetResult[3].components[j].ComponentID + ' - ' + data[i].assetResult[3].components[j].Component + '<ul><li>Serial Number: ' + data[i].assetResult[3].components[j].SerialNumber + '</li><li>AssetID: ' + data[i].assetResult[3].components[j].AssetID + '</li><li>Component Name: ' + data[i].assetResult[3].components[j].ComponentName + '</li><li>Component Model ID: ' + data[i].assetResult[3].components[j].ComponentModelID + '</li><li>Default Lab Format ID: ' + data[i].assetResult[3].components[j].DefaultLabFormatID + '</li></ul></li>';
            }
        } else {
            cD[i].innerHTML += '<li>(none)</li>';
        }
    }

    var oD = document.getElementsByClassName('oDetails');
    for (i = 0; i < oD.length; i++) {
        if (data[i].assetResult.length > 4) {
            for (j = 0; j < data[i].assetResult[4].observations.length; j++) {
                oD[i].innerHTML += '<li>' + data[i].assetResult[4].observations[j].ObservationID + ' - ' + data[i].assetResult[4].observations[j]._id + '<ul><li>Update User ID: ' + data[i].assetResult[4].observations[j].UpdateUserID + '</li><li>SiteID: ' + data[i].assetResult[4].observations[j].SiteID + '</li><li>Meter Event ID: ' + data[i].assetResult[4].observations[j].MeterEventID + '</li><li>Data Source ID: ' + data[i].assetResult[4].observations[j].DataSourceID + '</li><li>Trakka Exception Level ID: ' + data[i].assetResult[4].observations[j].TrakkaExceptionLevelID + '</li><li>Observation Exception Level ID: ' + data[i].assetResult[4].observations[j].ObservationExceptionLevelID + '</li><li>Import ID: ' + data[i].assetResult[4].observations[j].ImportID + '</li><li>Observation Code: ' + data[i].assetResult[4].observations[j].ObservationCode + '</li><li>Meter Reading: ' + data[i].assetResult[4].observations[j].MeterReading + '</li><li>Connection Code ID: ' + data[i].assetResult[4].observations[j].ConnectionCodeID + '</li><li>Observation Type ID: ' + data[i].assetResult[4].observations[j].ObservationTypeID + '</li></ul></li>';
            }
        } else {
            oD[i].innerHTML += '<li>(none)</li>';
        }
    }

    $(document).ready(function() {
        $('li').click(function(e){
            e.stopPropagation();
            try {
                if(this.getElementsByTagName("ul")[0].style.display =="block")
                    $(this).find("ul").slideUp();
                else
                    $(this).children(":first").slideDown();
            } catch(err) {

            }
        });
    });
})
.catch(err => {
    console.error('An error ocurred', err);
});