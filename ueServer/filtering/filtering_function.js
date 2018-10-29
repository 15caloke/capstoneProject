/*
 * Filters inputted data to convert JSON objects into strings for hashing with some error handling
 * Tries to convert a JSON type in JSON format and returns if it is correct
 * otherwise it will throw an error if the data type is fully incompatible
 * 
 * Date: 09/07/2018
 * Author: Calum Oke
 * 
 */

module.exports = {
    
    // Concatenates object values into a string
    convertObjToString: function(jsonObj) {
        var dataString = "";
        var add;

        for (value in jsonObj[0].asset[0]) {
            add = jsonObj[0].asset[0][value];
            dataString = dataString.concat(add);
        }

        // NO NEED TO INCLUDE SITE AND LOCATION DATA AS INPUT FOR HASH GENERATION
        // AS THEY ARE NOT RELATED TO ASSET HEALTH AND INCLUDING THEM MEANS THAT
        // IF SITE OR LOCATION DATA IS CHANGED, ALL RELATED ASSETS WILL HAVE TO BE
        // REHASHED AND HAVE A NEW BLOCK CREATED FOR THEM
        /* if (jsonObj.length > 1) {
            for (value in jsonObj[1].location[0]) {
                add = jsonObj[1].location[0][value];
                dataString = dataString.concat(add);
            }
        }

        if (jsonObj.length > 2) {
            for (value in jsonObj[2].site[0]) {
                add = jsonObj[2].site[0][value];
                dataString = dataString.concat(add);
            }
        } */

        if (jsonObj.length > 3) {
            for (var i = 0; i < jsonObj[3].components.length; i++) {
                for (value in jsonObj[3].components[i]) {
                    add = jsonObj[3].components[i][value];
                    dataString = dataString.concat(add);
                }
            }
        }

        if (jsonObj.length > 4) {
            for (var i = 0; i < jsonObj[4].observations.length; i++) {
                for (value in jsonObj[4].observations[i]) {
                    add = jsonObj[4].observations[i][value];
                    dataString = dataString.concat(add);
                }
            }
        }

        return dataString;
    }
 }